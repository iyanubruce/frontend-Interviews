type JSONPrimitive = null | boolean | number | string;
type JSONValue = JSONPrimitive | JSONObject;
type JSONObject = { [key: string]: JSONValue };

type AddOperation = {
  op: "add";
  path: string;
  value: JSONValue;
};

type RemoveOperation = {
  op: "remove";
  path: string;
};

type ReplaceOperation = {
  op: "replace";
  path: string;
  value: JSONValue;
};

type PatchOperation = AddOperation | RemoveOperation | ReplaceOperation;

export default function applyJsonPatch(
  document: JSONObject,
  operations: Array<PatchOperation>,
): JSONObject {
  throw new Error("Not implemented!");
}
