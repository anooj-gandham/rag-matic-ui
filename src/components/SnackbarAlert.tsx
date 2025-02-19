import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackbarAlertProps {
  message: string;
  onClose: () => void;
}

const SnackbarAlert: React.FC<SnackbarAlertProps> = ({ message, onClose }) => {
  return (
    <Snackbar open={Boolean(message)} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
