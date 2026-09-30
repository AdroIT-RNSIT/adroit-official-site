const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export function cloudinaryUrl(publicId, { width, height } = {}) {
  if (!cloudName || !publicId || publicId === "blank") return "";

  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push("c_fill");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${publicId}`;
}
