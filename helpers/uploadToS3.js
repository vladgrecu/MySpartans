require("dotenv").config;
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-sharp-s3");

const s3Config = new AWS.S3({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(new Error("Only accepting jpeg/png image files"), false);
  }
};

const multerS3Config = multerS3({
  s3: s3Config,
  Bucket: process.env.AWSBucketName,
  ACL: "public-read",
  Key: (req, file, callback) => {
    callback(null, file.originalname);
  },
  rotate: true,
  resize: {
    width: 350
  }
});

const upload = multer({
  storage: multerS3Config,
  limits: {
    fileSize: 1024 * 1024 * 7
  },
  fileFilter: fileFilter
});

exports.profileImage = upload;
