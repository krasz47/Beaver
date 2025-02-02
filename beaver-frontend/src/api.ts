import axios from "axios";

export const generateCode = async (nodes: string, edges: string) => {
  const response = await axios.post("http://localhost:5000/generate-code", {
    nodes,
    edges,
  });
  return response.data.code;
};

export const fetchBeaverResponse = async (code: string, message: string) => {
  console.log(code);
  const response = await axios.post("http://localhost:5000/api/chat", {
    code,
    message,
  });
  return response.data;
};
