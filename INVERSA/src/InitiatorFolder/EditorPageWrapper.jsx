// pages/EditorPageWrapper.jsx
// This component detects if a project is a team project and routes to the appropriate editor

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../utils/dataManager/index";
import EditorPage from "./EditorPage";
import TeamEditorPage from "./TeamEditorPage";

const EditorPageWrapper = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectData = await getProjectById(projectId);
        setProject(projectData);
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading editor...
      </div>
    );
  }

  // Route to TeamEditorPage if it's a team project, otherwise EditorPage
  if (project?.isTeamProject) {
    return <TeamEditorPage />;
  }

  return <EditorPage />;
};

export default EditorPageWrapper;
