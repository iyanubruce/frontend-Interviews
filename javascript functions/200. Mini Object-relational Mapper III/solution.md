# Mini Object-relational Mapper III — Solution

This follow-up adds one extra layer after the part II query pipeline: result shaping.

## Solution

`findMany()` still reads as a pipeline. The only new step is that, after filtering and sorting, the returned records are now shaped.

That gives four jobs:

1. Filter the stored records.
2. Sort them.
3. Shape each result with `select`.
4. Attach requested relations with `include`.

That separation is the main correctness rule in this question:

- Filtering and sorting still work on the full stored records.
- `select` decides which top-level scalar fields to expose.
- `include` resolves relations from metadata using `sourceKey` and `targetKey`.

For relation loading:

- A `'one'` relation returns the first matching related record or `null`.
- A `'many'` relation returns all matching related records in insertion order.

Because relation definitions are explicit, there is no need to infer foreign keys from naming conventions.

If neither `select` nor `include` is passed, the shaped result is just a shallow clone of the filtered and sorted record, preserving the behavior from the previous parts.

That clone boundary applies to related records too. Returned rows should be safe to mutate from the caller's perspective without changing the ORM's internal arrays, even though the clone is only shallow.

### Worked shaping example

If a playlist query asks for:

```ts
{
  select: { name: true },
  include: { tracks: true },
}
```

the selected scalar shape starts as `{ name: record.name }`, but relation lookup should still use the original stored playlist record. That matters because `select` might omit the `id` field that `tracks.sourceKey` needs. Treat `select` as output shaping, not as a mutation of the record used by later relation work.

For `include`, the relation metadata tells the loader exactly how to compare records:

```ts
playlist.id -> track.playlistId
```

The ORM should read the source key from the current playlist, find matching rows in the target model, shallow-clone those related rows, and attach them under the requested relation name.

| Pipeline step | Input used | Output |
| --- | --- | --- |
| `where` | full stored records | matching stored records |
| `orderBy` | full matching records | sorted stored records |
| `select` | one sorted record | top-level output fields |
| `include` | original sorted record plus relation metadata | cloned related records attached to output |

Keeping relation lookup after `select` but based on the original record is the key design decision. It lets `select: { name: true }` and `include: { tracks: true }` work even though `id` was not selected.

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

export interface RelationDefinition {
  model: string;
  type: 'one' | 'many';
  sourceKey: string;
  targetKey: string;
}

export type RelationMap = Record<string, Record<string, RelationDefinition>>;
export type SelectMap = Record<string, boolean>;
export type IncludeMap = Record<string, boolean>;

interface FindManyArgs {
  where?: WhereClause;
  orderBy?: Record<string, SortDirection>;
  select?: SelectMap;
  include?: IncludeMap;
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
  _relations: RelationMap;

  constructor(data: ORMData, relations: RelationMap = {}) {
    this._data = new Map();
    this._relations = relations;

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
    const sortedRecords = sortRecords(filteredRecords, args.orderBy);

    // Shape only after filtering/sorting so those steps still see the full stored record.
    return sortedRecords.map((record) =>
      this._shapeRecord(modelName, record, args),
    );
  }

  _shapeRecord(
    modelName: string,
    record: ORMRecord,
    args: FindManyArgs,
  ): ORMRecord {
    const nextRecord =
      args.select == null
        ? cloneRecord(record)
        : this._applySelect(record, args.select);

    if (args.include == null) {
      return nextRecord;
    }

    Object.entries(args.include).forEach(([relationName, shouldInclude]) => {
      if (!shouldInclude) {
        return;
      }

      const relationDefinition = this._relations[modelName]?.[relationName];

      if (relationDefinition == null) {
        return;
      }

      // Includes resolve from the original stored record, not the select-trimmed shape.
      nextRecord[relationName] = this._resolveRelation(
        record,
        relationDefinition,
      );
    });

    return nextRecord;
  }

  _applySelect(record: ORMRecord, select: SelectMap): ORMRecord {
    const nextRecord: ORMRecord = {};

    Object.entries(select).forEach(([field, selected]) => {
      if (selected) {
        nextRecord[field] = record[field];
      }
    });

    return nextRecord;
  }

  _resolveRelation(
    record: ORMRecord,
    relationDefinition: RelationDefinition,
  ): unknown {
    const relatedRecords = this._getModelRecords(relationDefinition.model);
    const matches = relatedRecords.filter(
      (relatedRecord) =>
        relatedRecord[relationDefinition.targetKey] ===
        record[relationDefinition.sourceKey],
    );

    return relationDefinition.type === 'one'
      ? matches.length === 0
        ? null
        : cloneRecord(matches[0])
      : cloneRecords(matches);
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

- Unknown include keys are ignored instead of creating extra output fields.
- Include values set to `false` should not load that relation.
- A `'one'` relation with no match returns `null`; a `'many'` relation with no matches returns `[]`.
- Included records are shallow clones so callers cannot mutate the ORM's internal storage through query results.
- Relation and model names come only from the constructor data and relation metadata; they are not hardcoded.

## Notes

- Running `select` and `include` after filtering/sorting keeps the query pipeline easy to follow.
- Relation resolution should use the original stored record, not the selected shape, so missing selected keys do not break includes.
- Returning shallow-cloned related records prevents callers from mutating the internal store.

## Techniques

- Object-oriented programming
- Query pipelines
- Result shaping
- Relation resolution from metadata

## Resources

- [Prisma Client select fields](https://www.prisma.io/docs/orm/prisma-client/queries/select-fields)
