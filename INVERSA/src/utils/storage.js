import { supabase } from "../lib/supabase";

export const getFileName = (url) => {

    if (!url)
        return null;

    // hanya proses file dari bucket images
    if (
        !url.includes(
            "/storage/v1/object/public/images/"
        )
    ) {

        return null;

    }

    return decodeURIComponent(

        url
            .split(
                "/images/"
            )[1]

    );

};


export const deleteStorageFile =
async (url) => {

    const fileName =
        getFileName(
            url
        );

    if (
        !fileName
    ) {

        console.log(
            "Skip external URL:",
            url
        );

        return;

    }

    try {

        console.log(
            "Deleting:",
            fileName
        );

        const {
            data,
            error
        } =
        await supabase
            .storage
            .from(
                "images"
            )
            .remove([
                fileName
            ]);

        if (
            error
        ) {

            console.error(
                "Storage delete error:",
                error
            );

            return;

        }

        console.log(
            "Deleted:",
            data
        );

    } catch (error) {

        console.error(
            "Delete failed:",
            error
        );

    }

};