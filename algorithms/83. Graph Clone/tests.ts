import { describe, expect, test } from "vitest";

import fn from "./graph-clone";
const runTestCases: any[] = [
  {
    input: [
      ["adjList", [[1, 2, 3], [0, 4, 6], [0, 6], [0, 5], [1], [3], [1, 2]]],
    ],
    output: [[1, 2, 3], [0, 4, 6], [0, 6], [0, 5], [1], [3], [1, 2]],
    explanation:
      "The input and output adjacency lists are identical because the given graph has been accurately cloned",
  },
  {
    input: [
      [
        "adjList",
        [
          [1, 2, 3, 8],
          [0, 4, 6],
          [0],
          [0, 5],
          [1, 10, 9],
          [3, 7, 9, 11],
          [1],
          [5],
          [0],
          [5, 4],
          [4],
          [5],
        ],
      ],
    ],
    output: [
      [1, 2, 3, 8],
      [0, 4, 6],
      [0],
      [0, 5],
      [1, 10, 9],
      [3, 7, 9, 11],
      [1],
      [5],
      [0],
      [5, 4],
      [4],
      [5],
    ],
    explanation:
      "The input and output adjacency lists are identical because the given graph has been accurately cloned",
  },
  {
    input: [
      [
        "adjList",
        [
          [1, 2, 3, 8],
          [0, 4, 6, 5],
          [0],
          [0, 5],
          [1],
          [3, 7, 1],
          [1],
          [5],
          [0],
        ],
      ],
    ],
    output: [
      [1, 2, 3, 8],
      [0, 4, 6, 5],
      [0],
      [0, 5],
      [1],
      [3, 7, 1],
      [1],
      [5],
      [0],
    ],
    explanation:
      "The input and output adjacency lists are identical because the given graph has been accurately cloned",
  },
];

class GraphNode {
  val: number;
  neighbors: GraphNode[];

  constructor(val: number) {
    this.val = val;
    this.neighbors = [];
  }
}

function createGraphFromAdjList(adjList: number[][]): GraphNode | null {
  if (adjList.length === 0) {
    return null;
  }

  const nodes = new Map<number, GraphNode>();

  // Create nodes
  for (let i = 0; i < adjList.length; i++) {
    nodes.set(i, new GraphNode(i));
  }

  // Create edges
  for (let i = 0; i < adjList.length; i++) {
    const node = nodes.get(i)!;
    for (const neighbor of adjList[i]) {
      node.neighbors.push(nodes.get(neighbor)!);
    }
  }

  // Return the head node (node with value 0)
  return nodes.get(0)!;
}

function createAdjListFromGraph(head: GraphNode | null): number[][] {
  if (head === null) {
    return [];
  }

  const adjListMap = new Map<number, number[]>();
  const visited = new Set<GraphNode>();
  const stack: GraphNode[] = [head];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);

    const neighbors: number[] = [];
    for (const neighbor of node.neighbors) {
      neighbors.push(neighbor.val);
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
    adjListMap.set(node.val, neighbors);
  }

  // Convert map to adjacency list
  const maxVal = Math.max(...Array.from(adjListMap.keys()));
  const adjList: number[][] = new Array(maxVal + 1).fill(0).map(() => []);

  Array.from(adjListMap.entries()).forEach(([key, value]) => {
    adjList[key] = value;
  });

  return adjList;
}

describe("graphClone", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`adjList = ${JSON.stringify(example.input[0][1], null, 2)}`, () => {
      const originalGraph = createGraphFromAdjList(example.input[0][1]);
      const clonedGraph = fn(originalGraph);

      // Additional check to ensure that the original graph and cloned graph are not the same instance
      expect(Object.is(clonedGraph, originalGraph)).toBe(false);

      expect(createAdjListFromGraph(clonedGraph)).toStrictEqual(example.output);
    });
  });
});
