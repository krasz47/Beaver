import React, { useRef, useState } from "react";
import ImageUpload from "./ImageUpload";
import DocumentationModal from "./DocumentationModal";

interface NavbarProps {
  onImport: (flowchartData: any) => void;
  onExport: () => void;
}

const Navbar = ({ onImport, onExport, onFlowchartImage }: NavbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false); // State for documentation modal
  const [showDropdown, setShowDropdown] = useState(false);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const flowchartData = JSON.parse(e.target?.result as string);
        onImport(flowchartData);
      } catch (error) {
        console.error("Invalid JSON file format");
      }
    };

    reader.readAsText(file);

    // Clear file input
    event.target.value = "";
  };

  const handleClipboardImport = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const flowchartData = JSON.parse(clipboardText.trim());
      onImport(flowchartData);
    } catch (error) {
      console.error("Clipboard does not contain valid JSON.");
    }
  };

  return (
    <nav className="w-full p-4 bg-[#1e1e1e] flex justify-between items-center shadow-md">
      <h1 className="text-white text-xl pl-2 font-bold">Beaver Education</h1>
      <div className="flex space-x-4">
        <ImageUpload onFlowchartExtracted={onFlowchartImage} />
        <button onClick={onExport} className="primary-btn">
          Export
        </button>

        {/* Import Dropdown */}
        <div className="relative">
          <button
            className="primary-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Import ▼
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                onClick={() => fileInputRef.current?.click()}
              >
                Import from File
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                onClick={handleClipboardImport}
              >
                Import from Clipboard
              </button>
            </div>
          )}

          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileImport}
          />
        </div>

        {/* Hamburger Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-xl"
          >
            ☰
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 shadow-lg rounded-lg">
              <button
                onClick={() => setIsCurriculumOpen(true)}
                className="block w-full p-3 text-left hover:bg-gray-700"
              >
                📚 Open Curriculum
              </button>
            </div>
          )}
        </div>

        {isCurriculumOpen && (
          <CurriculumModal onClose={() => setIsCurriculumOpen(false)} />
        )}

        {/* Documentation Icon */}
        <button
          onClick={() => setIsDocumentationOpen(true)}
          className="text-xl text-white hover:bg-gray-700 p-2 rounded-full"
          title="Documentation"
        >
          📖
        </button>
      </div>

      {isDocumentationOpen && (
        <DocumentationModal onClose={() => setIsDocumentationOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
