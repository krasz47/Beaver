import React, { useEffect, useRef } from "react";

interface NodeContextMenuProps {
  x: number;
  y: number;
  nodeId: string;
  onDelete: (nodeId: string) => void;
  onDuplicate: (nodeId: string) => void;
  onEdit: (nodeId: string) => void;
  onClose: () => void;
}

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  x,
  y,
  nodeId,
  onDelete,
  onDuplicate,
  onEdit,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute bg-midGray text-lightGray shadow-lg rounded-md p-2"
      style={{
        top: `${y}px`,
        left: `${x}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <button
        onClick={() => onEdit(nodeId)}
        className="block w-full text-left px-4 py-2 hover:bg-darkGray"
      >
        Edit Node
      </button>
      <button
        onClick={() => onDuplicate(nodeId)}
        className="block w-full text-left px-4 py-2 hover:bg-darkGray"
      >
        Duplicate Node
      </button>
      <button
        onClick={() => onDelete(nodeId)}
        className="block w-full text-left px-4 py-2 hover:bg-red-600"
      >
        Delete Node
      </button>
    </div>
  );
};

export default NodeContextMenu;
