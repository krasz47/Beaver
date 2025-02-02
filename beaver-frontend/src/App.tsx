import React, { useState } from "react";
import FlowDiagram from "./components/FlowDiagram";
import "./styles.css";

const App: React.FC = () => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center`}>
      <main className="flex flex-col w-full max-w-8xl bg-midGray rounded-lg shadow-lg">
        <FlowDiagram />
      </main>
    </div>
  );
};

export default App;
