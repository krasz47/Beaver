import React from "react";

interface DocumentationModalProps {
  onClose: () => void;
}

const DocumentationModal = ({ onClose }: DocumentationModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal content */}
      <div
        className="rounded-lg shadow-lg w-4/5 max-w-2xl p-6"
        style={{ backgroundColor: "#121212", color: "white" }} // Dark background with white text
      >
        <h2 className="text-2xl font-bold mb-4">📖 Beaver Documentation</h2>

        {/* General Introduction */}
        <p className="mb-4">
          Welcome to <strong>Beaver Education</strong>, an AI-powered platform designed to help users learn algorithms and design by creating flowcharts—perfect for anyone, even if you're new to coding! Here's a guide on how to maximize your experience with Beaver:
        </p>

        {/* Documentation Sections */}
        <ul className="list-disc pl-5 mb-4">
          <li>
            <strong>📂 Upload Flowcharts:</strong> Start by importing your flowcharts using the "Import" button. You can upload your flowchart from a file or copy-paste JSON data from your clipboard. Additionally, if you have a hand-drawn flowchart, upload it as an image, and Beaver will automatically interpret it.
          </li>
          <li>
            <strong>✨ Adding Nodes:</strong> Use the "Create Node" button to add nodes to your flowchart. You can customize each node by assigning:
            <ul className="list-disc pl-5">
              <li><strong>Labels:</strong> Identify your node with a specific name or description.</li>
              <li><strong>Parameters, Inputs, and Outputs:</strong> Define the data or values associated with the node to represent its functionality in the flowchart.</li>
            </ul>
          </li>
          <li>
            <strong>💻 Generate Working Code:</strong> Once your flowchart is built, click the "Generate Code" button to transform your flowchart into real, functional code. This powerful AI feature bridges the gap between visual design and programming.
          </li>
          <li>
            <strong>🤖 Use the Sidebar Assistant:</strong> On the sidebar of the app, you'll find an interactive AI assistant. Use this assistant to:
            <ul className="list-disc pl-5">
              <li>Ask questions about the generated code.</li>
              <li>Understand how specific parts of the code work.</li>
              <li>Get suggestions or ask for clarifications about algorithms or coding concepts.</li>
            </ul>
          </li>
          <li>
            <strong>📚 Explore the Learning Curriculum:</strong> Access our curriculum designed to enhance your algorithmic skills and knowledge. With <strong>20+ interactive exercises</strong>, you'll get hands-on practice and gain a deeper understanding of algorithm design, coding concepts, and problem-solving.
          </li>
        </ul>

        <p className="mb-4">
          Beaver Education is built to make algorithm design intuitive and approachable. Our goal is to empower creators, educators, and learners to bring their ideas to life, even if they're unfamiliar with code.
        </p>

        {/* Horizontal Divider and License Notice */}
        <hr className="border-gray-700 my-4" />
        <div className="text-gray-400 text-sm text-center">
          <p className="mb-2">© 2025 Alan Kraszewski and Arjun Juneja. All rights reserved.</p>
          <p>
            Licensed under the
            <a
              href="https://opensource.org/licenses/MIT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline ml-1"
            >
              MIT License
            </a>.
          </p>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal;
