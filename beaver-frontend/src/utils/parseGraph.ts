export const parseGraph = (nodes, edges) => {
  console.log("nodes", nodes);

  // Create a mapping of node IDs to their details
  const nodeMap = {};
  nodes.forEach((node) => {
    nodeMap[node.id] = {
      label: node.data.label,
      type: node.type,
      inputs: [],
      outputs: [],
    };
  });

  let adjacencyList = {};
  edges.forEach((edge) => {
    if (!adjacencyList[edge.source]) adjacencyList[edge.source] = [];
    adjacencyList[edge.source].push(edge.target);
  });

  let executionSteps = [];
  const visited = new Set();

  const formatExecutionFlow = (nodeId, depth = 0) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodeMap[nodeId];
    const indent = "   ".repeat(depth);
    let nodeStr = `${indent}${node.label} (${node.type})`;

    executionSteps.push(nodeStr);

    if (adjacencyList[nodeId]) {
      adjacencyList[nodeId].forEach((target) => {
        executionSteps.push(`${indent}├── →`);
        formatExecutionFlow(target, depth + 1);
      });
    }
  };

  const startNodes = nodes.filter(
    (node) => !edges.some((edge) => edge.target === node.id)
  );
  startNodes.forEach((startNode) => formatExecutionFlow(startNode.id));

  return executionSteps.join("\n");
};
