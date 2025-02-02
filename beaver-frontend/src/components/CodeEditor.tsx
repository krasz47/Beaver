import Editor from "@monaco-editor/react";
import React, { useEffect, useState } from "react";

const languageMap = {
  Python: "python",
  JavaScript: "javascript",
  Kotlin: "kotlin",
  Rust: "rust",
};

const CodeEditor = ({ code, selectedLanguage }) => {
  const [language, setLanguage] = useState(languageMap[selectedLanguage]);

  useEffect(() => {
    setLanguage(languageMap[selectedLanguage]);
  }, [selectedLanguage]);

  return (
    <div className="code-editor-container bg-darkGray p-4 shadow-md">
      <Editor
        height="400px"
        defaultLanguage="python"
        language={language}
        value={code}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
