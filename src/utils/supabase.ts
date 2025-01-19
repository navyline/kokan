import { createClient } from "@supabase/supabase-js";

// Initializing Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Sanitize file name by replacing special characters with "-"
 */
function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, "-");
}

/**
 * Upload file to Supabase Storage and return its public URL
 */
export async function uploadFile(file: File): Promise<string> {
  const sanitizedFileName = sanitizeFileName(file.name); // Sanitize file name
  const fileName = `${Date.now()}-${sanitizedFileName}`; // Add timestamp to ensure unique file name

  console.log("Uploading file:", fileName);

  // Step 1: Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from("Kokan_bucket") // Replace with your actual bucket name
    .upload(fileName, file, {
      cacheControl: "3600", // Cache for 1 hour
    });

  // Handle upload errors
  if (error) {
    console.error("Error uploading file:", error);
    throw new Error("Image upload failed!!!");
  }

  console.log("Upload response data:", data);

  // Step 2: Generate Public URL
  const { data: publicData } = supabase.storage
    .from("Kokan_bucket")
    .getPublicUrl(data.path);

  if (!publicData.publicUrl) {
    console.error("Error generating public URL");
    console.log("Attempting to generate Signed URL as fallback...");

    // Step 3: Fallback to Signed URL
    const { data: signedData, error: signedError } = await supabase.storage
      .from("Kokan_bucket")
      .createSignedUrl(data.path, 60 * 60); // URL valid for 1 hour

    if (signedError || !signedData?.signedUrl) {
      console.error("Error generating signed URL:", signedError);
      throw new Error("Failed to generate public or signed URL.");
    }

    console.log("Generated Signed URL:", signedData.signedUrl);
    return signedData.signedUrl;
  }

  console.log("Uploaded file URL:", publicData.publicUrl);
  return publicData.publicUrl;
}
