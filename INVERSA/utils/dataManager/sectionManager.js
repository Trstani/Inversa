// Section Manager - Handle chapter sections for team projects

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(`inversa_${key}`, JSON.stringify(data));
};

const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(`inversa_${key}`);
  return data ? JSON.parse(data) : null;
};

// ============= SECTIONS =============

export const loadSections = async (chapterId = null) => {
  const data = loadFromLocalStorage('sections');
  const sections = data?.sections || [];

  if (chapterId) {
    return sections.filter(s => s.chapterId === parseInt(chapterId));
  }

  return sections;
};

export const getSectionsByChapter = async (chapterId) => {
  const sections = await loadSections();
  return sections
    .filter(s => s.chapterId === parseInt(chapterId))
    .sort((a, b) => a.order - b.order);
};

export const createSection = async (chapterId, sectionData) => {
  const sections = await loadSections();
  const chapterSections = sections.filter(s => s.chapterId === parseInt(chapterId));

  const newSection = {
    id: Date.now(),
    chapterId: parseInt(chapterId),
    type: sectionData.type || 'text', // 'text' or 'image'
    order: chapterSections.length + 1,
    content: sectionData.content || '',
    assignedTo: sectionData.assignedTo || null,
    status: 'pending', // 'pending', 'in-progress', 'completed'
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  sections.push(newSection);
  saveToLocalStorage('sections', { sections });

  return newSection;
};

export const updateSection = async (sectionId, updates) => {
  const sections = await loadSections();
  const sectionIndex = sections.findIndex(s => s.id === parseInt(sectionId));

  if (sectionIndex >= 0) {
    sections[sectionIndex] = {
      ...sections[sectionIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveToLocalStorage('sections', { sections });
    return sections[sectionIndex];
  }

  return null;
};

export const deleteSection = async (sectionId) => {
  const sections = await loadSections();
  const filtered = sections.filter(s => s.id !== parseInt(sectionId));

  // Reorder remaining sections
  const reordered = filtered.map((section, index) => ({
    ...section,
    order: index + 1,
  }));

  saveToLocalStorage('sections', { sections: reordered });
  return reordered;
};

export const assignSectionToUser = async (sectionId, userId) => {
  const sections = await loadSections();
  const sectionIndex = sections.findIndex(s => s.id === parseInt(sectionId));

  if (sectionIndex >= 0) {
    sections[sectionIndex].assignedTo = userId;
    sections[sectionIndex].status = 'pending';
    sections[sectionIndex].updatedAt = new Date().toISOString();

    saveToLocalStorage('sections', { sections });
    return sections[sectionIndex];
  }

  return null;
};

export const updateSectionStatus = async (sectionId, status) => {
  const sections = await loadSections();
  const sectionIndex = sections.findIndex(s => s.id === parseInt(sectionId));

  if (sectionIndex >= 0) {
    sections[sectionIndex].status = status; // 'pending', 'in-progress', 'completed'
    sections[sectionIndex].updatedAt = new Date().toISOString();

    saveToLocalStorage('sections', { sections });
    return sections[sectionIndex];
  }

  return null;
};

export const getSectionById = async (sectionId) => {
  const sections = await loadSections();
  return sections.find(s => s.id === parseInt(sectionId));
};

export const deleteSectionsByChapter = async (chapterId) => {
  const sections = await loadSections();
  const filtered = sections.filter(s => s.chapterId !== parseInt(chapterId));

  saveToLocalStorage('sections', { sections: filtered });
  return filtered;
};
