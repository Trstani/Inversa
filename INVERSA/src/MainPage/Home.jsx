import React from "react";
import { useAuth } from "../context/AuthContext";

import Hero from "../section/Hero";
import ProjectCarousel from "../section/ProjectCarousel";
import RoleAction from "../section/RoleAction";
import ProjectsExplorer from "../section/ProjectsExplorer";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <Hero />

      {isAuthenticated && <RoleAction />}
      
      <ProjectCarousel />


      <ProjectsExplorer />
    </div>
  );
};

export default Home;
