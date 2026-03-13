import { saveToLocalStorage, loadFromLocalStorage } from "./storageUtils";

const REPORTS_KEY = "reports";

const getAllReports = () => {
    return loadFromLocalStorage(REPORTS_KEY) || [];
};

const saveReports = (reports) => {
    saveToLocalStorage(REPORTS_KEY, reports);
};

export const createReport = (reporterId, targetType, targetId, reason) => {

    const reports = getAllReports();

    const newReport = {
        id: Date.now() + Math.random(),
        reporterId,
        targetType,
        targetId,
        reason,
        status: "pending",
        createdAt: new Date().toISOString()
    };

    reports.push(newReport);

    saveReports(reports);

    return { success: true, report: newReport };

};

export const getAllReportsForAdmin = () => {

    return getAllReports();

};

export const resolveReport = (reportId) => {

    const reports = getAllReports();

    const report = reports.find(r => r.id === reportId);

    if (!report) {
        return { success: false, error: "Report not found" };
    }

    report.status = "resolved";

    saveReports(reports);

    return { success: true };

};