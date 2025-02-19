import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import QueryPage from "./pages/QueryPage";
import Layout from "./components/Layout";
import { CssBaseline } from "@mui/material";

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/query/:file_id" element={<QueryPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
