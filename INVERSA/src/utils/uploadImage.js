import { supabase } from "../lib/supabase";

export const uploadImage = async (file) => {

  if (!file) {
    throw new Error("No file selected");
  }

  const fileExt =
    file.name.split(".").pop();

  const fileName =
    `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

  const { error } =
    await supabase
      .storage
      .from("images")
      .upload(
        fileName,
        file
      );

  if (error) {
    throw error;
  }

  const { data } =
    supabase
      .storage
      .from("images")
      .getPublicUrl(
        fileName
      );

  return data.publicUrl;

};