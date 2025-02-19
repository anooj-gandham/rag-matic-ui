import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, CircularProgress } from "@mui/material";
import FileCard from "../components/FileCard";
import UploadModal from "../components/UploadModal";
import { get } from "../services/api";

interface FileData {
  id: string;
  name: string;
  url: string;
  file_type: string;
  uploaded_at: string;
  processed: boolean;
}

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [keepPolling, setKeepPolling] = useState(false);

  useEffect(() => {
    const loadFiles = async () => {
      const fileList = await get("/api/files");
      
      if (fileList) {
        setFiles(fileList);
        
        // Check if all files are processed
        const allProcessed = fileList.every((file: FileData) => file.processed);
    
        if (allProcessed) {
          setKeepPolling(false); // Stop polling
        }
      }
      setLoading(false);
    };

    loadFiles();

    // Polling interval to check for processed status
    const interval = setInterval(() => {
      if (!keepPolling){
        loadFiles();
      }
    }, 5000); // Poll every 5 seconds

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ textAlign: "left", p: 4 }}>
      <Typography variant="h4">Files</Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 2 }}>
        <Typography variant="body1">Uploaded Files</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
          + Upload
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {files.length > 0 ? (
            files.map((file) => (
              <Grid item xs={12} sm={6} md={4} key={file.id}>
                <FileCard file={file} />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ mt: 2, width: "100%" }}>
              No files uploaded yet.
            </Typography>
          )}
        </Grid>
      )}

      {/* Upload Modal */}
      <UploadModal open={openModal} handleClose={() => setOpenModal(false)} refreshFiles={() => {}} setKeepPolling={setKeepPolling} />
    </Box>
  );
};

export default UploadPage;
