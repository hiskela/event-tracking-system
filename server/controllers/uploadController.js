import cloudinary from "../config/cloudinary.js";

export const uploadEventImage = async (req, res) => {
  try {
    console.log("Upload request received");

    if (!req.file) {
      console.log("No file received");

      return res.status(400).json({
        message: "Event image is required",
      });
    }

    console.log("File received:", req.file.originalname);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "event-tracking/events",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(req.file.buffer);
    });

    console.log("Cloudinary upload successful:", result.secure_url);

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      message: error.message || "Failed to upload image",
    });
  }
};