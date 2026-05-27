export const validateImage = (file) => {

  if (!file) {
    return {
      valid: false,
      message: "No file selected"
    };
  }

  const MAX_SIZE =
    2 * 1024 * 1024;

  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png"
  ];

  if (
    file.size > MAX_SIZE
  ) {
    return {
      valid: false,
      message: "Maximum image size: 2MB"
    };
  }

  if (
    !ALLOWED_TYPES.includes(
      file.type
    )
  ) {
    return {
      valid: false,
      message: "Invalid image format"
    };
  }

  return {
    valid: true
  };

};