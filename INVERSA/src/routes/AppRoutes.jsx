import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../section/Header";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Pages
import Homepage from "../MainPage/Homepage";
import Explore from "../MainPage/Explore";
import Login from "../MainPage/Login";
import Register from "../MainPage/Register";
import Home from "../MainPage/Home";
import ProjectDetail from "../MainPage/ProjectDetail";
import EditorPage from "../InitiatorFolder/EditorPage";
import InitiatorDashboard from "../InitiatorFolder/InitiatorDashboard";
import CollaboratorDashboard from "../CollaboratorFolder/CollaboratorDashboard";
import ChapterReader from "../components/ChapterReader";

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-background">
      <Header />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/explore" element={<Explore />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/initiator"
          element={
            <ProtectedRoute>
              <InitiatorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/collaborator"
          element={
            <ProtectedRoute>
              <CollaboratorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/read/:projectId/:chapterId?"
          element={
            <ProtectedRoute>
              <ChapterReader />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor/:projectId/:chapterId?"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
