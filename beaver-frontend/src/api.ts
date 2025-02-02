import axios from "axios";

export const generateCode = async (
  nodes: string,
  edges: string,
  selectedLanguage: string
) => {
  const response = await axios.post("http://localhost:5000/generate-code", {
    nodes,
    edges,
    selectedLanguage,
  });
  return response.data.code;
};

import axios from "axios";

export const fetchBeaverResponse = async (code, messages) => {
  try {
    const response = await axios.post("http://localhost:5000/chat", {
      messages,
      code,
    });

    return response.data; // ✅ Expecting { message: "...", updated_code: "..." }
  } catch (error) {
    console.error("Chat error:", error);
    return { message: "Error processing request.", updated_code: null };
  }
};
