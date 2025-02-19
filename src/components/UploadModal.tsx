import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { uploadFile, post } from "../services/api";

interface UploadModalProps {
	open: boolean;
	handleClose: () => void;
	refreshFiles: () => void;
	setKeepPolling: (value: boolean) => void;
}
  

const UploadModal: React.FC<UploadModalProps> = ({ open, handleClose, refreshFiles, setKeepPolling }) => {
  const [name, setName] = useState("");
  const [fileType, setFileType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Handles File Selection & Upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      setUploading(true);
      const response = await uploadFile(file); // Calls the API to upload the file

      if (response?.url) {
        setFileUrl(response.url); // Sets the file URL for submission
      }

      setUploading(false);
    }
  };

  // Handles Form Submission
  const handleSubmit = async () => {
    if (!name || !fileUrl || !fileType) return;

    await post("/api/files/", { name, url: fileUrl, file_type: fileType });
    setKeepPolling(true);
    refreshFiles(); // Refresh file list after upload
    handleClose(); // Close modal
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ width: 400, bgcolor: "background.paper", p: 4, mx: "auto", mt: "20vh", borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Upload File</Typography>

        {/* File Picker */}
        <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
          Select File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        {/* Loading Indicator */}
        {uploading && <CircularProgress size={24} sx={{ display: "block", mx: "auto", mb: 2 }} />}

        {/* File URL Display */}
        {fileUrl && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            File uploaded: {fileUrl}
          </Typography>
        )}

        <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />

        <Select fullWidth value={fileType} onChange={(e) => setFileType(e.target.value)} displayEmpty sx={{ mb: 2 }}>
          <MenuItem value="">Select File Type</MenuItem>
          <MenuItem value="pdf">PDF</MenuItem>
          <MenuItem value="docx">DOCX</MenuItem>
          <MenuItem value="txt">TXT</MenuItem>
          <MenuItem value="json">JSON</MenuItem>
        </Select>

        <Button variant="contained" fullWidth onClick={handleSubmit} sx={{ mt: 2 }} disabled={!fileUrl}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default UploadModal;
