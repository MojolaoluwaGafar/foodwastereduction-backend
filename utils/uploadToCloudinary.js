const uploadToCloudinary = async (file) => {
  const cloudName = "dfrzhfxtd"; 
  const preset = "wasteless_unsigned";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};

export default uploadToCloudinary;
