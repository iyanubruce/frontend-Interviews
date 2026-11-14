# Mini Object-relational Mapper — Solution

The first design choice is the internal data model. Once records are stored by model name and cloned at the boundaries, each delegate method becomes small and predictable.

## Solution

The recommended model is a `Map` from model name to an array of records, plus one generated delegate object per model name.

That gives three useful properties:

1. Each model's data is isolated from the others.
2. The constructor can clone the input so outside mutations do not leak into the ORM.
3. The delegate methods can stay thin wrappers around shared helper methods.

Only `_data` should own mutable records. Anything crossing the ORM boundary is shallow-cloned either on the way in or on the way out.

That produces a structure like:

```ts
_data = Map(2) {
  'user' => [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ],
  'post' => [
    { id: 10, title: 'Hello' },
  ],
};
```

### Delegate generation walkthrough

The constructor should inspect the input model names and generate delegates from those keys:

```ts
new MiniORM({
  article: [...],
  comment: [...],
});
```

That instance should expose `db.article` and `db.comment` because those are the keys in the data object. There should not be any special case for a model named `user`, `post`, or `product`.

Each generated delegate can close over its model name and forward to shared helpers:

```ts
findMany(args) -> _findMany('article', args)
create(args) -> _create('article', args)
```

That keeps the public API model-specific while the shared helper logic remains reusable.

From there, each operation is straightforward:

- `findMany()` filters with exact top-level equality and returns shallow-cloned records.
- `create()` clones the input record before storing it and returns another clone.
- `update()` finds the first matching record, shallow-merges `data`, stores it, and returns a clone.
- `delete()` removes the first matching record and returns a clone of the removed value.

| Operation | Reads from storage | Writes to storage | Returns |
| --- | --- | --- | --- |
| `findMany` | Matching records | Nothing | New array of shallow clones |
| `create` | Target model array | Shallow clone of `data` appended | Shallow clone of created record |
| `update` | First exact match | Shallow-merged replacement | Shallow clone of updated record |
| `delete` | First exact match | Removes that record | Shallow clone of removed record |

Because the question only requires shallow cloning, nested objects and arrays can still share references with the stored records.

That boundary is what keeps the interview solution small: it protects top-level records from accidental caller mutation without implementing a general-purpose deep clone or schema validator.

```ts
export type ORMRecord = Record<string, unknown>;
export type ORMData = Record<string, Array<ORMRecord>>;
export type ExactWhere = Record<string, unknown>;

interface FindManyArgs {
  where?: ExactWhere;
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

function cloneRecord(record: ORMRecord): ORMRecord {
  return { ...record };
}

function cloneRecords(records: Array<ORMRecord>): Array<ORMRecord> {
  return records.map(cloneRecord);
}

function matchesWhere(record: ORMRecord, where: ExactWhere = {}): boolean {
  return Object.entries(where).every(
    ([field, value]) => record[field] === value,
  );
}

export default class MiniORM {
  [modelName: string]: any;

  _data: Map<string, Array<ORMRecord>>;

  constructor(data: ORMData) {
    this._data = new Map();

    Object.entries(data).forEach(([modelName, records]) => {
      // Clone once on ingest so later outside mutations do not leak into the store.
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
    const { where } = args;

    // Reads clone on the way out too, so callers cannot mutate stored records in place.
    return cloneRecords(
      records.filter((record) => matchesWhere(record, where)),
    );
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
      matchesWhere(record, args.where),
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
      matchesWhere(record, args.where),
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

- Delegate names must come from the input object keys; no model name is special.
- Initial data, created data, and returned records need shallow cloning, but nested references are intentionally shared.
- `where` matching is exact top-level `===` comparison across all provided fields.
- The prompt guarantees update and delete matches, so argument validation and not-found handling stay out of scope.

## Notes

- Using a `Map` keeps model lookup straightforward and avoids mixing stored data with helper properties on the instance.
- Exact-match filtering is just an `every()` over the `where` entries.
- Shallow cloning is enough for this question, so nested objects and arrays may still share references.

## Techniques

- Object-oriented programming
- Dynamic object properties
- Shallow cloning
- Filtering arrays of records

## Resources

- [Prisma Client overview](https://www.prisma.io/docs/orm/prisma-client)
