# Workspace Dependencies — Solution

The exercise is a graph traversal problem: each workspace package is a node, and each dependency is a directed edge. The failure mode to design around is returning a package before one of its local dependencies or recursing forever on a cycle.

## Solution

Use a post-order depth-first search over workspace-local packages only. Each package is added after its local dependencies, which is exactly the required output order.

Use depth-first search and keep track of the following while traversing:

1. `visiting`: packages currently in the recursion stack. If traversal reaches one of them again, a cycle has been found.
2. `resolved`: packages whose full dependency subtree has already been processed. This prevents duplicates and repeated work.
3. `result`: the output list. Push a package only after visiting its workspace-local dependencies.

Adding each package after its dependencies produces the required topological order.

External packages are easy to ignore: before recursing, check whether the dependency name exists in `workspace`. If it does not, skip it.

The root package is a traversal starting point, not an output dependency. The code uses the same post-order push for every package, then skips the push only when the finished package is the original `packageName`.

For this workspace:

```ts
{
  'web-app': ['ui-kit', 'analytics'],
  'ui-kit': ['shared-utils'],
  analytics: ['shared-utils'],
  'shared-utils': [],
}
```

The post-order traversal is:

| Visit | Action |
| --- | --- |
| `web-app -> ui-kit -> shared-utils` | push `shared-utils` |
| finish `ui-kit` | push `ui-kit` |
| `web-app -> analytics -> shared-utils` | already resolved, skip duplicate |
| finish `analytics` | push `analytics` |
| finish `web-app` | do not push root package |

```ts
export default function workspaceDependencies(
  workspace: Record<string, string[]>,
  packageName: string,
): string[] {
  const visiting = new Set<string>();
  const resolved = new Set<string>();
  const result: string[] = [];

  function hasWorkspacePackage(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(workspace, name);
  }

  function visit(name: string): void {
    // Re-entering a package already on the current DFS stack means there's a cycle.
    if (visiting.has(name)) {
      throw new Error('Cycle detected');
    }

    if (resolved.has(name)) {
      return;
    }

    visiting.add(name);

    for (const dependency of workspace[name]) {
      if (!hasWorkspacePackage(dependency)) {
        continue;
      }

      visit(dependency);
    }

    visiting.delete(name);
    resolved.add(name);

    // Post-order insertion keeps dependencies ahead of the package that needs them.
    if (name !== packageName) {
      result.push(name);
    }
  }

  visit(packageName);

  return result;
}
```

## Edge cases

- External dependencies are not workspace nodes, so they should not appear in the output and should not be traversed.
- Shared dependencies should appear once even if more than one reachable package depends on them.
- Self-references and indirect cycles are caught by the `visiting` set before they can recurse forever.
- The root package starts the traversal but is intentionally omitted from the dependency list.

## Notes

- A `visiting` set is the standard recursion-stack technique for detecting direct, indirect, and self-referential cycles.
- A package is appended to the result exactly once, after all of its reachable local dependencies, so shared subgraphs stay deduplicated and ordered.
- Kahn's algorithm can produce a different valid topological order. Any alternative implementation must return the same left-to-right DFS post-order required by the prompt.
