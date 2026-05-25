import { apiClient } from "../api/client";
import { deleteStorageFile } from "./storage";

export const cleanupProjectImages =
    async (projectId) => {

        try {

            const chaptersResponse =
                await apiClient
                    .chapters
                    .getByProject(
                        projectId
                    );

            const chapters =
                chaptersResponse.data || [];

            for (
                const chapter of chapters
            ) {

                const sectionsResponse =
                    await apiClient
                        .sections
                        .getByChapter(
                            chapter.id
                        );

                const sections =
                    sectionsResponse.data || [];

                for (
                    const section of sections
                ) {

                    if (
                        section.type === "image" &&
                        section.image_url
                    ) {

                        await deleteStorageFile(
                            section.image_url
                        );

                    }

                }

            }

        } catch (error) {

            console.error(
                "Cleanup failed:",
                error
            );

        }

    };