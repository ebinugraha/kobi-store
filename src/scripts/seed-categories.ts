import db from "@/db"; // Pastikan path ini benar
import fs from "fs";
import path from "path";
import { UTApi } from "uploadthing/server";
import { categories } from "../db/schema/categories";

const categoriesData = [
  { name: "Phone", slug: "phone" },
  { name: "Batik", slug: "batik" },
];

async function main() {
  console.log("Seeding categories...");

  try {
    const utapi = new UTApi();

    // Buat array untuk menyimpan promise semua upload
    const uploadPromises = categoriesData.map(async (category) => {
      const imagePath = path.join(
        process.cwd(),
        "public",
        `${category.slug}.png`
      );

      // Periksa apakah file ada
      if (!fs.existsSync(imagePath)) {
        throw new Error(`File not found: ${imagePath}`);
      }

      const imageBuffer = fs.readFileSync(imagePath);

      // Upload ke UploadThing
      const uploadResponse = await utapi.uploadFiles(
        new File([imageBuffer], `${category.slug}.png`, { type: "image/png" })
      );

      if (!uploadResponse.data?.url) {
        throw new Error(`Failed to upload image for category ${category.name}`);
      }

      return {
        name: category.name,
        slug: category.slug,
        imageUrl: uploadResponse.data.url, // Gunakan .url bukan .ufsUrl
      };
    });

    // Tunggu semua upload selesai
    const categoryValues = await Promise.all(uploadPromises);

    await db.insert(categories).values(categoryValues);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

main();
