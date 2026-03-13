import { saveToLocalStorage, loadFromLocalStorage } from "./storageUtils";
import { loadChapters } from "./chapterManager";


// =======================
// LOAD CONTRIBUTIONS
// =======================

export const loadContributions = (chapterId = null) => {

    const data = loadFromLocalStorage("contributions");
    const contributions = data?.contributions || [];

    if (chapterId) {
        return contributions.filter(
            c => c.chapterId === parseInt(chapterId)
        );
    }

    return contributions;

};


// =======================
// GET CONTRIBUTION BY ID
// =======================

export const getContributionById = (id) => {

    const contributions = loadContributions();

    return contributions.find(
        c => c.id === parseInt(id)
    );

};


// =======================
// SUBMIT CONTRIBUTION
// =======================

export const submitContribution = (contribution) => {

    const data = loadFromLocalStorage("contributions");
    const contributions = data?.contributions || [];

    const newContribution = {

        ...contribution,

        id: Date.now(),

        status: "pending",

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString()

    };

    contributions.push(newContribution);

    saveToLocalStorage("contributions", { contributions });

    return newContribution;

};


// =======================
// UPDATE CONTRIBUTION
// =======================

export const updateContribution = (id, updatedData) => {

    const data = loadFromLocalStorage("contributions");
    const contributions = data?.contributions || [];

    const updated = contributions.map(c => {

        if (c.id === parseInt(id)) {

            return {
                ...c,
                ...updatedData,
                updatedAt: new Date().toISOString()
            };

        }

        return c;

    });

    saveToLocalStorage("contributions", { contributions: updated });

    return updated;

};


// =======================
// DELETE CONTRIBUTION
// =======================

export const deleteContribution = (id) => {

    const contributions = loadContributions();

    const filtered = contributions.filter(
        c => c.id !== parseInt(id)
    );

    saveToLocalStorage("contributions", { contributions: filtered });

    return filtered;

};


// =======================
// APPROVE CONTRIBUTION (MERGE)
// =======================

export const approveContribution = async (contributionId) => {

    const data = loadFromLocalStorage("contributions");
    const contributions = data?.contributions || [];

    const contribution = contributions.find(
        c => c.id === parseInt(contributionId)
    );

    if (!contribution) return null;

    const chapters = await loadChapters();

    const chapterIndex = chapters.findIndex(
        c => c.id === contribution.chapterId
    );

    if (chapterIndex >= 0) {

        chapters[chapterIndex] = {

            ...chapters[chapterIndex],

            content: contribution.content,

            updatedAt: new Date().toISOString()

        };

        saveToLocalStorage("chapters", { chapters });

    }

    const updated = contributions.map(c => {

        if (c.id === parseInt(contributionId)) {

            return {
                ...c,
                status: "approved",
                updatedAt: new Date().toISOString()
            };

        }

        return c;

    });

    saveToLocalStorage("contributions", { contributions: updated });

    return contribution;

};


// =======================
// REJECT CONTRIBUTION
// =======================

export const rejectContribution = (contributionId) => {

    const data = loadFromLocalStorage("contributions");
    const contributions = data?.contributions || [];

    const updated = contributions.map(c => {

        if (c.id === parseInt(contributionId)) {

            return {
                ...c,
                status: "rejected",
                updatedAt: new Date().toISOString()
            };

        }

        return c;

    });

    saveToLocalStorage("contributions", { contributions: updated });

    return updated;

};


// =======================
// GET PENDING CONTRIBUTIONS
// =======================

export const getPendingContributions = (chapterId) => {

    const contributions = loadContributions(chapterId);

    return contributions.filter(
        c => c.status === "pending"
    );

};


// =======================
// GET USER CONTRIBUTIONS
// =======================

export const getUserContributions = (userId) => {

    const contributions = loadContributions();

    return contributions.filter(
        c => c.authorId === userId
    );

};