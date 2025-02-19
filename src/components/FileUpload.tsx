import React, { useState } from "react";
import { Button, Input, Box } from "@mui/material";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
      <Input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="secondary" onClick={handleUpload} sx={{ mt: 2 }}>
        Upload
      </Button>
    </Box>
  );
};

export default FileUpload;
