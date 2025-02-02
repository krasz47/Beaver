import React, { useState } from "react";

const NodeEditModal = ({ node, onClose, onSave }) => {
  const [label, setLabel] = useState(node.data.label);
  const [color, setColor] = useState(node.data.color);
  const [value, setValue] = useState(node.data.value || "");
  const [inputs, setInputs] = useState([...node.data.inputs]);
  const [outputs, setOutputs] = useState([...node.data.outputs]);

  const addInput = () => setInputs([...inputs, `Input ${inputs.length + 1}`]);
  const removeInput = (index) =>
    setInputs(inputs.filter((_, i) => i !== index));

  const addOutput = () =>
    setOutputs([...outputs, `Output ${outputs.length + 1}`]);
  const removeOutput = (index) =>
    setOutputs(outputs.filter((_, i) => i !== index));

  const handleSave = () => {
    onSave({
      ...node,
      data: { ...node.data, label, color, value, inputs, outputs },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal">
        <h2 className="modal-header">Edit Node</h2>

        <input
          type="text"
          placeholder="Label"
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
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div>
          <strong>Inputs</strong>
          {inputs.map((input, idx) => (
            <div key={idx} className="flex space-x-2">
              <input
                type="text"
                value={input}
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
          {outputs.map((output, idx) => (
            <div key={idx} className="flex space-x-2">
              <input
                type="text"
                value={output}
                onChange={(e) => {
                  const updated = [...outputs];
                  updated[idx] = e.target.value;
                  setOutputs(updated);
                }}
              />
              <button
                onClick={() => removeOutput(idx)}
                className="bg-red-500 text-white px-2 py-1 rounded"
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
          <button onClick={handleSave} className="primary-btn">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeEditModal;
