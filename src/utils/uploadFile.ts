import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Initialize S3 client

console.log("endpoint:",process.env.ENDPOINT);
console.log("access id:",process.env.ACCESS_ID);
console.log(process.env.SECRET_KEY);
console.log(process.env.BUCKET_NAME);

const s3client = new S3Client({
  endpoint: process.env.ENDPOINT as string,
  region: "auto", 
  credentials: {
    accessKeyId: process.env.ACCESS_ID as string ,
    secretAccessKey: process.env.SECRET_KEY as string,
  },
  forcePathStyle: true, 
});

export const uploadFile = async (filename: string, localFilePath: string) => {
  console.log("Upload called for file:", filename);

  // Create read stream
  const fileStream = fs.createReadStream(localFilePath);  // for asynchronous reading of a file ,takes a larger portion of a file and reading it into a chunks of a file, less memory intensive than fs.readfilesync()

  // Configure upload
  const upload = new Upload({
    client: s3client,
    params: {
      Bucket: process.env.BUCKET_NAME as string,
      Key: filename,
      Body: fileStream,
    },
  });

  // Optional: Track progress
  upload.on("httpUploadProgress", (progress) => {
    console.log(`Uploaded ${progress.loaded} bytes`);
  });

  try {
    const result = await upload.done();
    console.log("Upload successful:", result);
    return result;
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
};
