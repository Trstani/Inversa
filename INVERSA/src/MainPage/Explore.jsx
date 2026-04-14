import { useEffect, useState } from "react";
import { loadPublishedProjects } from '../utils/dataManager/projectManager';
import RecommendationSidebar from "../section/RecommendationSidebar";
import ProjectsExplorer from "../section/ProjectsExplorer";

const Explore = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await loadPublishedProjects();
            setProjects(Array.isArray(data) ? data : []);
        };

        fetchProjects();
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">

                <div className="md:col-span-2 lg:col-span-3">
                    <ProjectsExplorer />
                </div>

                <div className="md:col-span-1">
                    <RecommendationSidebar projects={projects} />
                </div>

            </div>
        </section>
    );
};

export default Explore