import { useAuth } from "../context/AuthContext";
import useInitiatorDashboard from "./hooks/useInitiatorDashboard";

import DashboardHeader from "./components/DashboardHeader";
import CreateProjects from "./components/CreateProjects";
import CollaborationRequest from "./components/CollaborationRequest";
import ProjectList from "./components/ProjectList";

const InitiatorDashboard = () => {
    const { user } = useAuth();

    const {
        projects,
        requests,
        loading,
        createProject,
        removeProject,
        approve,
        reject,
    } = useInitiatorDashboard(user);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-background dark:bg-dark-background py-8">
            <div className="max-w-7xl mx-auto px-4">

                <DashboardHeader />

                <CreateProjects onCreate={createProject} />

                <CollaborationRequest
                    requests={requests}
                    projects={projects}
                    onApprove={approve}
                    onReject={reject}
                />


                <ProjectList
                    projects={projects}
                    onDelete={removeProject}
                />

            </div>
        </div>
    );
};

export default InitiatorDashboard;
