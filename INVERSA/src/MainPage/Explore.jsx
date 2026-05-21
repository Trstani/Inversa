import { useEffect, useState } from "react";
import { apiClient } from '../api/client';
import RecommendationSidebar from "../section/RecommendationSidebar";
import ProjectsExplorer from "../section/ProjectsExplorer";
import TeamsExplorer from '../section/TeamsExplorer';
import {
  FiBook,
  FiUsers,
} from 'react-icons/fi';

const Explore = () => {
    const [projects, setProjects] = useState([]);

    const [activeTab, setActiveTab] = useState('projects');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiClient.projects.getPublished();
                const data = response.data || [];
                setProjects(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjects([]);
            }
        };

        fetchProjects();
    }, []);

    return (

        <section
            className="
      max-w-7xl
      mx-auto

      px-4 sm:px-6 lg:px-8

      py-6 sm:py-8
    "
        >

            {/* TABS */}

            <div
                className="
        mb-8

        flex gap-3

        border-b

        border-light-border
        dark:border-dark-border
      "
            >

                {/* PROJECTS */}

                <button
                    onClick={() =>
                        setActiveTab(
                            'projects'
                        )
                    }
                    className={`
          flex items-center gap-2

          px-4 py-3

          text-sm font-medium

          transition-all

          border-b-2

          ${activeTab ===
                            'projects'

                            ? `
                border-light-accent
                dark:border-dark-accent

                text-light-accent
                dark:text-dark-accent
              `

                            : `
                border-transparent

                text-light-secondary
                dark:text-dark-secondary
              `
                        }
        `}
                >

                    <FiBook className="w-4 h-4" />

                    Projects

                </button>

                {/* TEAMS */}

                <button
                    onClick={() =>
                        setActiveTab(
                            'teams'
                        )
                    }
                    className={`
          flex items-center gap-2

          px-4 py-3

          text-sm font-medium

          transition-all

          border-b-2

          ${activeTab ===
                            'teams'

                            ? `
                border-light-accent
                dark:border-dark-accent

                text-light-accent
                dark:text-dark-accent
              `

                            : `
                border-transparent

                text-light-secondary
                dark:text-dark-secondary
              `
                        }
        `}
                >

                    <FiUsers className="w-4 h-4" />

                    Teams

                </button>

            </div>

            {/* PROJECTS */}

            {activeTab === 'projects' && (

                <div
                    className="
          grid
          grid-cols-1
          md:grid-cols-3
          lg:grid-cols-4

          gap-4 lg:gap-8
        "
                >

                    <div className="md:col-span-2 lg:col-span-3">

                        <ProjectsExplorer />

                    </div>

                    <div className="md:col-span-1">

                        <RecommendationSidebar
                            projects={projects}
                        />

                    </div>

                </div>

            )}

            {/* TEAMS */}

            {activeTab === 'teams' && (

                <TeamsExplorer />

            )}

        </section>
    );
};

export default Explore