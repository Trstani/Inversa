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
import EditorPageWrapper from "../InitiatorFolder/EditorPageWrapper";
import UserDashboard from "../InitiatorFolder/UserDashboard";
import TeamDetailPage from "../InitiatorFolder/TeamDetailPage";
import ChapterReader from "../components/ChapterReader";
import AdminDashboard from "../AdminFolder/AdminDashboard";

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

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/initiator"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teams"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard?tab=teams" replace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team/:teamId"
          element={
            <ProtectedRoute>
              <TeamDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/collaborator"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard/teams" replace />
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
              <EditorPageWrapper />
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
