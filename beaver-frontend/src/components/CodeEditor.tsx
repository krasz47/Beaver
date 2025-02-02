import Editor from "@monaco-editor/react";

const CodeEditor = ({ code }) => {
  return (
    <div className="code-editor-container bg-darkGray p-4 shadow-md">
      <Editor
        height="400px"
        defaultLanguage="python"
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
