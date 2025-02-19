import React from "react";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ color: "white", textDecoration: "none" }}>
            Upload
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>{children}</Container>
    </>
  );
};

export default Layout;
