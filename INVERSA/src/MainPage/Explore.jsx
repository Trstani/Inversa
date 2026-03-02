import { useEffect, useState } from "react";
import { loadProjects } from "../utils/dataManager";
import RecommendationSidebar from "../section/RecommendationSidebar";
import ProjectsExplorer from "../section/ProjectsExplorer";

const Explore = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await loadProjects();
            setProjects(Array.isArray(data) ? data : []);
        };

        fetchProjects();
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                <div className="lg:col-span-3">
                    <ProjectsExplorer />
                </div>

                <div className="lg:col-span-1">
                    <RecommendationSidebar projects={projects} />
                </div>

            </div>
        </section>
    );
};

export default Explore