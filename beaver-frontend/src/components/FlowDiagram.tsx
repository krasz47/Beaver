import React, { useCallback, useState } from "react";
import setRefresh from "react";
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
import EdgeContextMenu from "./EdgeContextMenu";

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
  const [edgeContextMenu, setEdgeContextMenu] = useState<{
    x: number;
    y: number;
    edgeId: string;
  } | null>(null);

  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
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

      setTimeout(() => setEdges((edges) => [...edges]), 0);
    },
    [setEdges]
  );

  const handleLoadExercise = (exerciseData) => {
    setCurrentExercise(exerciseData);
    setNodes(exerciseData.nodes);
    setEdges([]);
  };

  const handleShowSolution = () => {
    if (!currentExercise) {
      alert("❌ No active exercise. Select one from the curriculum.");
      return;
    }

    // fetch from /exercises/solutions.json [currentExercise.id]

    // Update nodes and edges with solution data

    fetch(`/exercises/solutions.json`)
      .then((response) => response.json())
      .then((solutions) => {
        const solution = solutions[currentExercise.id - 1];
        if (solution) {
          setNodes(solution.nodes);
          setEdges(solution.edges);
        } else {
          alert("❌ Solution not found for the current exercise.");
        }
      })
      .catch((error) => {
        console.error("Error fetching solution:", error);
        alert("❌ Error fetching solution.");
      });
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
      (conn) =>
        !edges.some(
          (edge) => edge.source == conn.from && edge.target == conn.to
        )
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

  const forceUpdate = () => setRefresh((prev) => prev + 1);
  const handleGenerateCode = async () => {
    const code = await generateCode(
      JSON.stringify(nodes),
      JSON.stringify(edges),
      selectedLanguage
    );
    setGeneratedCode(code);
  };

  const handleNodeRightClick = (event: React.MouseEvent, nodeId: string) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, nodeId });
  };

  const handleEdgeRightClick = (event: React.MouseEvent, edgeId: string) => {
    event.preventDefault();
    setEdgeContextMenu({ x: event.clientX, y: event.clientY, edgeId });
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

  const handleDeleteEdge = (edgeId: string) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
    setEdgeContextMenu(null);
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
    handleClearFlowchart();

    if (flowchartData.nodes && flowchartData.edges) {
      const formattedEdges = flowchartData.edges.map((edge) => ({
        ...edge,
        id:
          edge.id ||
          `${edge.source}-${edge.target}-${edge.sourceHandle || ""}-${
            edge.targetHandle || ""
          }`,
      }));

      setNodes(flowchartData.nodes);
      setEdges(formattedEdges);
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
      id: `${edge.source}-${edge.target}-${edge.sourceHandle}-${edge.targetHandle}`,
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
        onLanguageChange={setSelectedLanguage}
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
              onEdgeContextMenu={(event, edge) =>
                handleEdgeRightClick(event, edge.id)
              }
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

            {edgeContextMenu && (
              <EdgeContextMenu
                x={edgeContextMenu.x}
                y={edgeContextMenu.y}
                edgeId={edgeContextMenu.edgeId}
                onDelete={handleDeleteEdge}
                onClose={() => setEdgeContextMenu(null)}
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
              <>
                <button
                  onClick={handleValidateExercise}
                  className="primary-btn"
                >
                  Validate Exercise
                </button>
                <button onClick={handleShowSolution} className="primary-btn">
                  Show Solution
                </button>
              </>
            )}
          </div>

          <CodeEditor
            code={generatedCode}
            selectedLanguage={selectedLanguage}
          />
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
            onClose={() => {
              setTimeout(() => setNodes((nodes) => [...nodes]), 0);
              setIsEditModalOpen(false);
            }}
            onSave={(updatedNode) => {
              setNodes((prevNodes) =>
                prevNodes.map((node) =>
                  node.id === updatedNode.id ? updatedNode : node
                )
              );
              setIsEditModalOpen(false);
              forceUpdate();
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
