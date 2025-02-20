const BACKEND_BASE_URL = "http://54.235.61.83:8000";
// const BACKEND_BASE_URL = "http://localhost:8000";

export const get = async (endpoint: string) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`GET ${endpoint} failed`);
    return await response.json();
  } catch (error) {
    console.error("GET request error:", error);
    return null;
  }
};

export const post = async (endpoint: string, body: any) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`POST ${endpoint} failed`);
    return await response.json();
  } catch (error) {
    console.error("POST request error:", error);
    return null;
  }
};

// Upload File & Return URL
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/upload-file/`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("File upload failed");
    return await response.json();
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};
