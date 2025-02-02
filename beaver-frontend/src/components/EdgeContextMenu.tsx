import React from "react";

interface EdgeContextMenuProps {
  x: number;
  y: number;
  edgeId: string;
  onDelete: (edgeId: string) => void;
  onClose: () => void;
}

const EdgeContextMenu: React.FC<EdgeContextMenuProps> = ({
  x,
  y,
  edgeId,
  onDelete,
  onClose,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`,
        background: "#252525",
        color: "white",
        padding: "8px",
        borderRadius: "5px",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
      }}
      onMouseLeave={onClose} // Close when the mouse leaves
    >
      <button
        style={{
          color: "white",
          background: "red",
          border: "none",
          padding: "5px 10px",
          cursor: "pointer",
        }}
        onClick={() => onDelete(edgeId)}
      >
        Delete Edge
      </button>
    </div>
  );
};

export default EdgeContextMenu;
