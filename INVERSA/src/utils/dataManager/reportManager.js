import { API_BASE_URL, saveToLocalStorage, loadFromLocalStorage } from "./storageUtils";
import { hideProject } from "./projectManager";


// ============= REPORTS =============

export const loadReports = async (projectId = null) => {

  try {

    const url = projectId
      ? `${API_BASE_URL}/reports?projectId=${projectId}`
      : `${API_BASE_URL}/reports`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(2000)
    });

    if (response.ok) {

      const data = await response.json();

      return data?.reports || [];

    }

  } catch (error) {

    console.warn('API unavailable, using localStorage');

  }

  const data = loadFromLocalStorage('reports');

  const allReports = data?.reports || [];

  if (projectId) {

    return allReports.filter(
      r => r.projectId === parseInt(projectId)
    );

  }

  return allReports;

};



// ==============================
// REPORT PROJECT
// ==============================

export const reportProject = async (reportData) => {

  try {

    const response = await fetch(`${API_BASE_URL}/reports`, {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(reportData),

      signal: AbortSignal.timeout(2000)

    });

    if (response.ok) {

      return await loadReports();

    }

  } catch (error) {

    console.warn('API unavailable, using localStorage');

  }

  const data = loadFromLocalStorage('reports');

  const reports = data?.reports || [];

  const alreadyReported = reports.find(r =>

    r.projectId === parseInt(reportData.projectId) &&
    r.reportedBy === reportData.reportedBy

  );

  if (alreadyReported) {

    throw new Error("You already reported this project");

  }

  const newReport = {

    id: Date.now(),

    projectId: parseInt(reportData.projectId),

    reportedBy: reportData.reportedBy,

    reason: reportData.reason,

    note: reportData.note || "",

    status: "pending",

    createdAt: new Date().toISOString()

  };

  reports.push(newReport);

  saveToLocalStorage('reports', { reports });


  /*
  =========================
  AUTO HIDE PROJECT
  =========================
  */

  
  const projectReports = reports.filter(
      r => r.projectId === parseInt(reportData.projectId)
  );

  if (projectReports.length >= 12) {

      await hideProject(reportData.projectId);

  }
  

  return reports;

};



// ==============================
// DELETE REPORT
// ==============================

export const deleteReport = async (reportId) => {

  try {

    const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {

      method: 'DELETE',

      signal: AbortSignal.timeout(2000)

    });

    if (response.ok) {

      return await loadReports();

    }

  } catch (error) {

    console.warn('API unavailable, using localStorage');

  }

  const data = loadFromLocalStorage('reports');

  const reports = data?.reports || [];

  const filtered = reports.filter(
    r => r.id !== reportId
  );

  saveToLocalStorage('reports', { reports: filtered });

  return filtered;

};



// ==============================
// GET REPORTS BY PROJECT
// ==============================

export const getReportsByProject = async (projectId) => {

  const reports = await loadReports();

  return reports.filter(
    r => r.projectId === parseInt(projectId)
  );

};