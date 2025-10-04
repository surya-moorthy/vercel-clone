import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Initialize S3 client

console.log("endpoint:",process.env.ENDPOINT);
console.log("access id:",process.env.ACCESS_ID);
console.log(process.env.SECRET_KEY);

const s3client = new S3Client({
  endpoint: process.env.ENDPOINT as string,
  region: "auto", // R2 doesn’t need AWS region
  credentials: {
    accessKeyId: process.env.ACCESS_ID as string ,
    secretAccessKey: process.env.SECRET_KEY as string,
  },
  forcePathStyle: true, // needed for some S3-compatible endpoints
});

export const uploadFile = async (filename: string, localFilePath: string) => {
  console.log("Upload called for file:", filename);

  // Create read stream
  const fileStream = fs.createReadStream(localFilePath);

  // Configure upload
  const upload = new Upload({
    client: s3client,
    params: {
      Bucket: "vercel",
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
