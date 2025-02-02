import React, { memo } from "react";
import { Handle, Position } from "reactflow";

interface NodeProps {
  id: string;
  data: {
    label: string;
    color: string;
    inputs: string[];
    outputs: string[];
    value?: string;
  };
}

const CustomNode: React.FC<NodeProps> = ({ id, data }) => {
  // Calculate node height dynamically based on the larger number of inputs or outputs
  const numHandles = Math.max(data.inputs.length, data.outputs.length);
  const nodeHeight = Math.max(80, 40 + numHandles * 25);

  return (
    <div
      className="relative flex flex-col justify-center items-center rounded-lg shadow-lg text-white text-center p-3"
      style={{
        backgroundColor: data.color,
        minHeight: `${nodeHeight}px`,
        width: "180px",
        padding: "10px 20px",
      }}
    >
      {/* Node Title */}
      <strong className="text-lg">{data.label}</strong>
      {data.value && <p className="mt-1 text-sm opacity-90">{data.value}</p>}

      {/* Render Input Handles */}
      {data.inputs.map((inputLabel, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={inputLabel} // Ensures unique and correctly labeled handle ID
          style={{
            top: `${(index + 1) * (100 / (data.inputs.length + 1))}%`,
            left: "-12px",
            backgroundColor: "#222",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
          }}
        />
      ))}

      {/* Render Output Handles */}
      {data.outputs.map((outputLabel, index) => (
        <Handle
          key={`output-label-${index}`}
          type="source"
          position={Position.Right}
          id={outputLabel} // unique and correctly labeled handle ID
          style={{
            top: `${(index + 1) * (100 / (data.outputs.length + 1))}%`,
            right: "-12px",
            backgroundColor: "#222",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
          }}
        />
      ))}

      {/* Input Labels */}
      {data.inputs.map((inputLabel, index) => (
        <span
          key={`input-label-${index}`}
          className="absolute left-[-90px] bg-gray-800 text-white px-2 py-1 text-xs rounded shadow-md"
          style={{
            top: `${(index + 1) * (100 / (data.inputs.length + 1))}%`,
            whiteSpace: "nowrap",
          }}
        >
          {inputLabel}
        </span>
      ))}

      {/* Output Labels */}
      {data.outputs.map((outputLabel, index) => (
        <span
          key={`output-label-${index}`}
          className="absolute right-[-90px] bg-gray-800 text-white px-2 py-1 text-xs rounded shadow-md"
          style={{
            top: `${(index + 1) * (100 / (data.outputs.length + 1))}%`,
            whiteSpace: "nowrap",
          }}
        >
          {outputLabel}
        </span>
      ))}
    </div>
  );
};

export default memo(CustomNode);
