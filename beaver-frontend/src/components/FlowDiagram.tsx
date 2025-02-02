import React, { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { generateCode } from "../api";
import CodeEditor from "./CodeEditor";
import ChatWindow from "./ChatWindow";
import CustomNode from "./CustomNodes";
import NodeCreationModal from "./NodeCreationModal";
import NodeContextMenu from "./NodeContextMenu";
import NodeEditModal from "./NodeEditModal";
import Navbar from "./Navbar";
import CurriculumModal from "./CurriculumModal";

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const FlowDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId: string;
  } | null>(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [completedExercises, setCompletedExercises] = useState(() => {
    return JSON.parse(localStorage.getItem("completedExercises")) || [];
  });

  // Handle duplicated edge connections with correct `sourceHandle` and `targetHandle`
  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => [
        ...eds,
        {
          ...connection,
          id: `${connection.source}-${connection.target}-${connection.sourceHandle}`,
          sourceHandle: connection.sourceHandle || null,
          targetHandle: connection.targetHandle || null,
        },
      ]);
    },
    [setEdges]
  );

  const handleLoadExercise = (exerciseData) => {
    setCurrentExercise(exerciseData);
    setNodes(exerciseData.nodes);
    setEdges([]);
  };

  const handleValidateExercise = () => {
    if (!currentExercise) {
      alert("❌ No active exercise. Select one from the curriculum.");
      return;
    }

    const { validation } = currentExercise;

    // Ensure required nodes exist
    const missingNodes = validation.requiredNodes.filter(
      (reqNode) => !nodes.some((node) => node.data.label === reqNode)
    );

    // Ensure required edges exist
    console.log(edges);
    console.log(validation.correctConnections);
    const incorrectEdges = validation.correctConnections.filter(
      (conn) => !edges.some((edge) => edge.sourceHandle === conn.label)
    );

    if (missingNodes.length === 0 && incorrectEdges.length === 0) {
      alert("✅ Correct! You have completed the exercise.");

      // Mark the exercise as completed
      setCompletedExercises((prev) => {
        const updated = [...new Set([...prev, currentExercise.id])];
        localStorage.setItem("completedExercises", JSON.stringify(updated));
        return updated;
      });
    } else {
      alert(
        `❌ Incorrect. Missing nodes: ${missingNodes.join(
          ", "
        )}. Incorrect connections: ${incorrectEdges.length}`
      );
    }
  };

  const handleGenerateCode = async () => {
    const code = await generateCode(
      JSON.stringify(nodes),
      JSON.stringify(edges)
    );
    setGeneratedCode(code);
  };

  const handleNodeRightClick = (event: React.MouseEvent, nodeId: string) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, nodeId });
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodes.find((node) => node.id === nodeId));
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
    setContextMenu(null);
  };

  const handleDuplicateNode = (nodeId: string) => {
    const nodeToDuplicate = nodes.find((node) => node.id === nodeId);
    if (!nodeToDuplicate) return;

    const newNode = {
      id: Math.random().toString(), // Unique ID (lol)
      type: nodeToDuplicate.type,
      position: {
        x: nodeToDuplicate.position.x + 50, // Slight offset to avoid overlap
        y: nodeToDuplicate.position.y + 50,
      },
      data: { ...JSON.parse(JSON.stringify(nodeToDuplicate.data)) },
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
    setContextMenu(null);
  };

  const handleExport = () => {
    const flowchartData = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([flowchartData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "flowchart.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const handleImport = (flowchartData) => {
    if (flowchartData.nodes && flowchartData.edges) {
      setNodes([...nodes, ...flowchartData.nodes]);
      setEdges([...edges, ...flowchartData.edges]);
    } else {
      console.error("Invalid flowchart format");
    }
  };

  const handleClearFlowchart = () => {
    setNodes([]);
    setEdges([]);
    setCurrentExercise(null);
  };

  const handleFlowchartExtracted = (flowchartData) => {
    const formattedEdges = flowchartData.edges.map((edge) => ({
      ...edge,
      id: `${edge.source}-${edge.target}-${edge.sourceHandle}`,
      sourceHandle: edge.sourceHandle || null,
      targetHandle: edge.targetHandle || null,
    }));

    setNodes((prevNodes) => [...prevNodes, ...flowchartData.nodes]);
    setEdges((prevEdges) => [...prevEdges, ...formattedEdges]);
  };

  return (
    <div className="flex-grow h-screen">
      <Navbar
        onImport={handleImport}
        onExport={handleExport}
        onFlowchartImage={handleFlowchartExtracted}
        onOpenCurriculum={() => setIsCurriculumOpen(true)}
      />
      <div className="flex w-full h-screen p-6 bg-darkGray rounded-md">
        <div className="flex flex-col flex-grow w-4/5 pr-6">
          <div className="h-[600px] border border-lightGray rounded-md relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              proOptions={{ hideAttribution: true }}
              onNodeContextMenu={(event, node) =>
                handleNodeRightClick(event, node.id)
              }
              onNodeClick={(event, node) => {
                handleNodeClick(node.id);
                setIsEditModalOpen(true);
              }}
            >
              <Controls />
              <Background />
            </ReactFlow>

            {contextMenu && (
              <NodeContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                nodeId={contextMenu.nodeId}
                onDelete={handleDeleteNode}
                onDuplicate={handleDuplicateNode}
                onEdit={(nodeId) => {
                  setSelectedNode(nodes.find((node) => node.id === nodeId));
                  setIsEditModalOpen(true);
                  setContextMenu(null);
                }}
                onClose={() => setContextMenu(null)}
              />
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <button onClick={handleGenerateCode} className="primary-btn">
              Generate Code
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="primary-btn"
            >
              + Create Node
            </button>
            <button onClick={handleClearFlowchart} className="primary-btn">
              Clear Canvas
            </button>

            {currentExercise && (
              <button onClick={handleValidateExercise} className="primary-btn">
                Validate Exercise
              </button>
            )}
          </div>

          <CodeEditor code={generatedCode} />
        </div>

        <div className="w-1/5 flex flex-col bg-[#1e1e1e] rounded-lg shadow-lg p-4">
          <ChatWindow code={generatedCode} onUpdateCode={setGeneratedCode} />
        </div>

        {isCreateModalOpen && (
          <NodeCreationModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreateNode={(newNode) => {
              setNodes((prevNodes) => [...prevNodes, newNode]);
              setIsCreateModalOpen(false);
            }}
          />
        )}

        {isEditModalOpen && selectedNode && (
          <NodeEditModal
            node={selectedNode}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(updatedNode) => {
              setNodes((prevNodes) =>
                prevNodes.map((node) =>
                  node.id === updatedNode.id ? updatedNode : node
                )
              );
              setIsEditModalOpen(false);
            }}
          />
        )}

        {isCurriculumOpen && (
          <CurriculumModal
            onClose={() => setIsCurriculumOpen(false)}
            onLoadExercise={handleLoadExercise}
          />
        )}
      </div>
    </div>
  );
};

export default FlowDiagram;
