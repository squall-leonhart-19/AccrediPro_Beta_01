import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

/**
 * List all avatar files from R2 bucket
 */

const R2_ACCOUNT_ID = "5329609816d063edb11f40003176f19d";
const R2_ACCESS_KEY_ID = "5b51a27a34062b14f7f25b2d16d0f4f5";
const R2_SECRET_ACCESS_KEY = "4fd5133a6a8dd01f3c4b016d98bd1ef0b21117800599e7f0bc0e6ee3f6eef125";
const R2_BUCKET = "accredipro-assets";
const R2_PUBLIC_URL = "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function listAvatars() {
  console.log("Listing avatars from R2 bucket...\n");

  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET,
    Prefix: "avatars/",
    MaxKeys: 1000,
  });

  try {
    const response = await s3Client.send(command);
    const avatars = response.Contents || [];

    console.log(`Found ${avatars.length} files in avatars/ folder:\n`);

    // Generate public URLs
    const avatarUrls: string[] = [];
    for (const obj of avatars) {
      if (obj.Key && obj.Key !== "avatars/") {
        const url = `${R2_PUBLIC_URL}/${obj.Key}`;
        avatarUrls.push(url);
        console.log(`- ${obj.Key} (${Math.round((obj.Size || 0) / 1024)} KB)`);
      }
    }

    console.log(`\n\nTotal avatar URLs: ${avatarUrls.length}`);
    console.log("\nSample URLs:");
    avatarUrls.slice(0, 5).forEach(url => console.log(url));

    return avatarUrls;
  } catch (error) {
    console.error("Error listing avatars:", error);
    return [];
  }
}

listAvatars();
