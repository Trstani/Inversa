// utils/dataManager/collaborationManager.js

import { loadFromLocalStorage, saveToLocalStorage } from "./storageUtils";

const COLLAB_REQUESTS_KEY = "collaborationRequests";

export const loadCollaborationRequests = () => {
  const data = loadFromLocalStorage(COLLAB_REQUESTS_KEY);
  return data?.requests || [];
};

export const saveCollaborationRequest = (request) => {
  const data = loadFromLocalStorage(COLLAB_REQUESTS_KEY) || {};
  const requests = data.requests || [];
  requests.push(request);
  saveToLocalStorage(COLLAB_REQUESTS_KEY, { requests });
};