# Mini Object-relational Mapper II — Solution

Mini ORM II reuses the same storage and delegate model from [Mini Object-relational Mapper](/questions/javascript/mini-orm). The extra work is all inside `findMany()`.

## Solution

Keep the part I storage model, but make `findMany()` a query pipeline over stored records:

1. Read the stored records for the model.
2. Filter them with `where`.
3. Sort the matched records with `orderBy`.
4. Return shallow-cloned results.

The key addition is supporting two kinds of `where` values:

- Plain values for exact equality.
- Operator objects such as `{ gte: 18, lt: 30 }`.

The compatibility rule is important: an object is treated as an operator object only if it contains a recognized operator key. Otherwise it falls back to the exact-match behavior from part I.

For each field condition:

- exact values use `===`
- `in` checks membership in an array
- `gt`, `gte`, `lt`, and `lte` compare with the stored field value
- `contains` checks substring membership for strings

Then `orderBy` is just a single-field sort applied after filtering.

The read path is therefore "predicate first, ordering second, cloning last". If cloning happens too early, the filtering code does extra work; if sorting happens before filtering, records that will be discarded can still influence comparator work; if cloning is skipped, callers can mutate stored records through the returned array.

### Worked filtering example

Given this condition:

```ts
{
  price: { gte: 10, lt: 50 },
  category: { in: ['hardware', 'accessories'] },
}
```

a record has to pass every top-level field. For `price`, it must pass both operators on that one field. For `category`, it must appear in the allowed list. A record that passes the price range but has `category: 'stationery'` should still be excluded because different fields use AND semantics.

| Record | Price check | Category check | Included? |
| --- | --- | --- | --- |
| `{ price: 12, category: 'stationery' }` | passes | fails | no |
| `{ price: 60, category: 'hardware' }` | fails | passes | no |
| `{ price: 18, category: 'hardware' }` | passes | passes | yes |

Sorting should see only the records that survived filtering. Cloning should happen after sorting so the code can sort stored record references without doing extra work, then return safe shallow copies to the caller.

```ts
export type ORMRecord = Record<string, unknown>;
export type ORMData = Record<string, Array<ORMRecord>>;
export type ExactWhere = Record<string, unknown>;

type SortDirection = 'asc' | 'desc';

export interface FieldOperators {
  in?: Array<unknown>;
  gt?: unknown;
  gte?: unknown;
  lt?: unknown;
  lte?: unknown;
  contains?: string;
}

export type WhereValue = unknown | FieldOperators;
export type WhereClause = Record<string, WhereValue>;

interface FindManyArgs {
  where?: WhereClause;
  orderBy?: Record<string, SortDirection>;
}

interface CreateArgs {
  data: ORMRecord;
}

interface UpdateArgs {
  where: ExactWhere;
  data: Partial<ORMRecord>;
}

interface DeleteArgs {
  where: ExactWhere;
}

interface ModelDelegate {
  findMany(args?: FindManyArgs): Array<ORMRecord>;
  create(args: CreateArgs): ORMRecord;
  update(args: UpdateArgs): ORMRecord;
  delete(args: DeleteArgs): ORMRecord;
}

const OPERATOR_KEYS = new Set(['in', 'gt', 'gte', 'lt', 'lte', 'contains']);

function cloneRecord(record: ORMRecord): ORMRecord {
  return { ...record };
}

function cloneRecords(records: Array<ORMRecord>): Array<ORMRecord> {
  return records.map(cloneRecord);
}

function isOperatorObject(value: unknown): value is FieldOperators {
  return (
    value != null &&
    !Array.isArray(value) &&
    typeof value === 'object' &&
    Object.keys(value).some((key) => OPERATOR_KEYS.has(key))
  );
}

function matchesExactWhere(record: ORMRecord, where: ExactWhere = {}): boolean {
  return Object.entries(where).every(
    ([field, value]) => record[field] === value,
  );
}

function matchesFieldCondition(
  recordValue: unknown,
  condition: WhereValue,
): boolean {
  // Objects without recognized operators still use the exact-match behavior from part I.
  if (!isOperatorObject(condition)) {
    return recordValue === condition;
  }

  if ('in' in condition && !condition.in!.includes(recordValue)) {
    return false;
  }

  if ('gt' in condition && !((recordValue as any) > (condition.gt as any))) {
    return false;
  }

  if ('gte' in condition && !((recordValue as any) >= (condition.gte as any))) {
    return false;
  }

  if ('lt' in condition && !((recordValue as any) < (condition.lt as any))) {
    return false;
  }

  if ('lte' in condition && !((recordValue as any) <= (condition.lte as any))) {
    return false;
  }

  if (
    'contains' in condition &&
    (typeof recordValue !== 'string' ||
      !recordValue.includes(condition.contains!))
  ) {
    return false;
  }

  return true;
}

function matchesWhere(record: ORMRecord, where: WhereClause = {}): boolean {
  return Object.entries(where).every(([field, condition]) =>
    matchesFieldCondition(record[field], condition),
  );
}

function sortRecords(
  records: Array<ORMRecord>,
  orderBy?: Record<string, SortDirection>,
): Array<ORMRecord> {
  if (orderBy == null) {
    return records;
  }

  const [field, direction] = Object.entries(orderBy)[0];
  const multiplier = direction === 'desc' ? -1 : 1;

  return records.slice().sort((recordA, recordB) => {
    if (recordA[field] === recordB[field]) {
      return 0;
    }

    return (recordA[field] as any) > (recordB[field] as any)
      ? multiplier
      : -multiplier;
  });
}

export default class MiniORM {
  [modelName: string]: any;

  _data: Map<string, Array<ORMRecord>>;

  constructor(data: ORMData) {
    this._data = new Map();

    Object.entries(data).forEach(([modelName, records]) => {
      this._data.set(modelName, cloneRecords(records));
      this[modelName] = this._createDelegate(modelName);
    });
  }

  _createDelegate(modelName: string): ModelDelegate {
    return {
      findMany: (args: FindManyArgs = {}) => this._findMany(modelName, args),
      create: (args: CreateArgs) => this._create(modelName, args),
      update: (args: UpdateArgs) => this._update(modelName, args),
      delete: (args: DeleteArgs) => this._delete(modelName, args),
    };
  }

  _findMany(modelName: string, args: FindManyArgs = {}): Array<ORMRecord> {
    const records = this._getModelRecords(modelName);
    const filteredRecords = records.filter((record) =>
      matchesWhere(record, args.where),
    );

    // Sort the matched records before cloning them for the caller.
    return cloneRecords(sortRecords(filteredRecords, args.orderBy));
  }

  _create(modelName: string, args: CreateArgs): ORMRecord {
    const records = this._getModelRecords(modelName);
    const nextRecord = cloneRecord(args.data);

    records.push(nextRecord);

    return cloneRecord(nextRecord);
  }

  _update(modelName: string, args: UpdateArgs): ORMRecord {
    const records = this._getModelRecords(modelName);
    const recordIndex = records.findIndex((record) =>
      matchesExactWhere(record, args.where),
    );
    const nextRecord = {
      ...records[recordIndex],
      ...args.data,
    };

    records[recordIndex] = nextRecord;

    return cloneRecord(nextRecord);
  }

  _delete(modelName: string, args: DeleteArgs): ORMRecord {
    const records = this._getModelRecords(modelName);
    const recordIndex = records.findIndex((record) =>
      matchesExactWhere(record, args.where),
    );
    const [deletedRecord] = records.splice(recordIndex, 1);

    return cloneRecord(deletedRecord);
  }

  _getModelRecords(modelName: string): Array<ORMRecord> {
    return this._data.get(modelName) ?? [];
  }
}
```

## Edge cases

- Multiple operators on the same field also use AND semantics; a field must satisfy all provided operators.
- `contains` is intentionally string-only. Non-string stored values should not match a `contains` operator.
- `orderBy` contains exactly one field, so the comparator only needs one key and one direction.
- Returned arrays and records are shallow clones, while nested object references are preserved.
- `update()` and `delete()` deliberately keep exact top-level `where` matching, so the richer operator language is confined to reads.

## Common pitfalls

- Treating every object condition as an operator object breaks exact-match behavior from the first question. Only objects with recognized operator keys should take the operator path.
- Filtering and sorting after cloning creates extra work and makes the clone helpers responsible for query semantics.
- Extending `update()` or `delete()` with the richer operator syntax goes beyond this follow-up; the new query language applies only to reads.

## Notes

- Treating unrecognized objects as exact-match values preserves backwards compatibility with part I.

## Techniques

- Object-oriented programming
- Query predicate composition
- Sorting arrays of records
- Preserving backwards-compatible APIs

## Resources

- [Prisma Client filtering and sorting](https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting)
