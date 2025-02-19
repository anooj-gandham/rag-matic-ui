import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Button, CircularProgress, TextField } from '@mui/material';
import { get, post } from '../services/api';
import FileCard from '../components/FileCard';

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
  const [loading, setLoading] = useState(true);
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchFiles();

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    const response = await get('/api/files');
    if (response) {
      setFiles(response);
      setLoading(false);
      checkProcessingStatus(response);
    }
  };

  const checkProcessingStatus = (files: FileData[]) => {
    const allProcessed = files.every((file) => file.processed);
    if (!allProcessed && !pollingRef.current) {
      pollingRef.current = setInterval(async () => {
        const updatedFiles = await get('/api/files');
        if (updatedFiles) {
          setFiles(updatedFiles);
          const allProcessed = updatedFiles.every((file: FileData) => file.processed);
          if (allProcessed && pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      }, 5000); // Poll every 5 seconds
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileInput(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!fileInput) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', fileInput);

    const response = await post('/api/upload-file', formData);
    if (response && response.success) {
      fetchFiles();
      setFileInput(null);
    }
    setUploading(false);
  };

  return (
    <Box sx={{ textAlign: 'left', p: 4 }}>
      <Typography variant="h4">Upload Documents</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <TextField
          type="file"
          onChange={handleFileChange}
          inputProps={{ accept: '.pdf,.docx,.txt,.json' }}
          sx={{ mr: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!fileInput || uploading}
        >
          {uploading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </Box>
      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {files.length > 0 ? (
            files.map((file) => (
              <Grid item xs={12} sm={6} md={4} key={file.id}>
                <FileCard file={file} />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              No files uploaded yet.
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default UploadPage;
