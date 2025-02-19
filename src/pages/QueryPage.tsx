import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { post, get } from "../services/api";

const QueryPage: React.FC = () => {
  const { file_id } = useParams<{ file_id: string }>();
  const [query, setQuery] = useState("What is a Large Concept Model?");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null); // Track polling interval

  // Handles query submission
  const handleQuerySubmit = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);

    const response = await post("/api/query-generate/", { file_id, query });
    console.log(response);
    if (response?.task_id) {
      pollForResult(response.task_id); // Start polling
    }
  };

  // Polls for query result using taskId
  const pollForResult = async (taskId: string) => {
    console.log("Polling for result with taskId:", taskId);
    pollingRef.current = setInterval(async () => {
      const statusResponse = await get(`/api/query-status?task_id=${taskId}`);
      console.log(statusResponse);

      if (statusResponse?.status === "SUCCESS") {
        setResult(statusResponse.result);
        setLoading(false);
        clearPolling(); // Stop polling
      }
    }, 3000);
  };

  // Clears polling interval
  const clearPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  // Cleanup polling when component unmounts
  useEffect(() => {
    return () => clearPolling();
  }, []);

  return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Typography variant="h6">Selected File: {file_id}</Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Ask your query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ my: 2, p: 2, bgcolor: "#a5c7ff", borderRadius: 2 }}
      />

      <Button variant="contained" color="primary" onClick={handleQuerySubmit} disabled={loading}>
        {loading ? <CircularProgress size={20} /> : "Send"}
      </Button>

      {/* Show processing status */}
      {loading && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Processing...
        </Typography>
      )}

      {/* Show query result */}
      {result && (
        <Box sx={{ mt: 4, p: 2, bgcolor: "white", borderRadius: 2 }}>
          <Typography variant="h6">Answer:</Typography>
          <Box
            sx={{ mt: 2, textAlign: "left" }} // Ensures content is left-aligned
            dangerouslySetInnerHTML={{ __html: result }}
          />
        </Box>
      )}
    </Box>
  );
};

export default QueryPage;
