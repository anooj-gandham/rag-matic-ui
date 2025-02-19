import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

interface FileProps {
  file: {
    id: string;
    name: string;
    url: string;
    file_type: string;
    uploaded_at: string;
    processed: boolean;
  };
}

const FileCard: React.FC<FileProps> = ({ file }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/query/${file.id}`);
  };

  return (
    <Card
      sx={{ maxWidth: 250, bgcolor: "#a5c7ff", p: 2, borderRadius: 4, cursor: "pointer" }}
      onClick={handleClick}
    >
      <CardContent>
        <Typography variant="h6">{file.name}</Typography>
        <Typography variant="body2">{new Date(file.uploaded_at).toLocaleDateString()}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href={file.url} target="_blank" onClick={(e) => e.stopPropagation()}>
          <DownloadIcon />
        </Button>
        <Button size="small" color="secondary" onClick={(e) => e.stopPropagation()}>
          <DeleteIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

export default FileCard;
