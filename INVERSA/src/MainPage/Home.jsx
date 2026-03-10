import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loadProjects } from "../utils/dataManager";

import BentoGrid from "../section/BentoGrid"; 
import ProjectCarousel from "../section/ProjectCarousel";
import Recommendation from "../section/Recommendation";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await loadProjects();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const trending = [...projects]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 9);

  const mostLiked = [...projects]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 9);

  return (
    <div className="min-h-screen">
      {/* Bento Grid baru menggantikan Hero + RoleAction */}
      <BentoGrid
        trending={trending}
        mostLiked={mostLiked}
        isAuthenticated={isAuthenticated}
        totalProjects={projects.length}   // jumlah proyek real
        totalCreators="1.2k"              // bisa diganti dengan data sesungguhnya
      />

      {/* Bagian bawah tetap sama */}
      <ProjectCarousel />
      <Recommendation type="trending" projects={trending} />
      <Recommendation type="likes" projects={mostLiked} />
    </div>
  );
};

export default Home;