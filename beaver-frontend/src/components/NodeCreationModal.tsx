import React, { useState } from "react";
import { Node } from "reactflow";

interface NodeCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNode: (nodeData: Node) => void;
}

const NodeCreationModal: React.FC<NodeCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateNode,
}) => {
  const [label, setLabel] = useState("New Node");
  const [color, setColor] = useState("#252525");
  const [value, setValue] = useState("");
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState(["Output 1"]);

  const addInput = () => setInputs([...inputs, `Input ${inputs.length + 1}`]);
  const removeInput = (index: number) =>
    setInputs(inputs.filter((_, i) => i !== index));

  const addOutput = () =>
    setOutputs([...outputs, `Output ${outputs.length + 1}`]);
  const removeOutput = (index: number) =>
    setOutputs(outputs.filter((_, i) => i !== index));

  const handleCreateNode = () => {
    const newNode = {
      id: Math.random().toString(),
      type: "custom",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label, color, value, inputs, outputs },
    };
    onCreateNode(newNode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal">
        <h2 className="modal-header">Create a New Block</h2>

        <input
          type="text"
          placeholder="Block Prompt"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Value or Condition"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="mb-3">
          <strong>Inputs</strong>
          {inputs.map((inp, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                value={inp}
                onChange={(e) => {
                  const updated = [...inputs];
                  updated[idx] = e.target.value;
                  setInputs(updated);
                }}
              />
              <button
                onClick={() => removeInput(idx)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                ×
              </button>
            </div>
          ))}
          <button onClick={addInput} className="primary-btn w-full">
            + Add Input
          </button>
        </div>

        <div>
          <strong>Outputs</strong>
          {outputs.map((out, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                value={out}
                onChange={(e) => {
                  const updated = [...outputs];
                  updated[idx] = e.target.value;
                  setOutputs(updated);
                }}
              />
              <button
                onClick={() => removeOutput(idx)}
                className="bg-red-500 text-white px-2 py-1 rounded"
                disabled={outputs.length <= 1}
              >
                ×
              </button>
            </div>
          ))}
          <button onClick={addOutput} className="primary-btn w-full">
            + Add Output
          </button>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="secondary-btn">
            Cancel
          </button>
          <button onClick={handleCreateNode} className="primary-btn">
            Create Block
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeCreationModal;
