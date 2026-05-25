import { apiClient } from "../api/client";
import { deleteStorageFile } from "./storage";

export const cleanupChapterImages =
    async (chapterId) => {

        try {

            console.log(
                "START CLEANUP:",
                chapterId
            );

            const response =
                await apiClient
                    .sections
                    .getByChapter(
                        chapterId
                    );

            console.log(
                "SECTION RESPONSE:",
                response
            );

            const sections =
                response.data || [];

            console.log(
                "SECTIONS:",
                sections
            );

            for (
                const section
                of sections
            ) {

                console.log(
                    "SECTION:",
                    section
                );

                if (
                    section.type === "image"
                    &&
                    section.image_url
                ) {

                    console.log(
                        "DELETE:",
                        section.image_url
                    );

                    await deleteStorageFile(
                        section.image_url
                    );

                }

            }

            console.log(
                "CLEANUP DONE"
            );

        } catch (error) {

            console.error(
                "Chapter cleanup failed:",
                error
            );

        }

    };