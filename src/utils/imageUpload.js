export const imageUpload = async (image) => {
  let imgArr = [];
  for (const item of image) {
    const formData = new FormData();
    formData.append("file", item);
    formData.append("upload_preset", process.env.CLOUD_UPLOAD_PRESET);
    formData.append("cloud_name", process.env.CLOUD_NAME);

    const res = await fetch(process.env.CLOUD_API_URL, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    imgArr.push({ public_id: data.public_id, url: data.secure_url });
  }
  return imgArr;
};
