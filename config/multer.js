const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mocmed-reports",
    resource_type: "raw", // important for pdf
    format: async (req, file) => "pdf",
    public_id: (req, file) => Date.now() + "-report",
  },
});

const upload = multer({ storage });

module.exports = upload;
