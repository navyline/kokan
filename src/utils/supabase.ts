import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, "-");
}

export async function uploadFile(file: File): Promise<string> {
  const sanitizedFileName = sanitizeFileName(file.name);
  const fileName = `${Date.now()}-${sanitizedFileName}`;

  console.log("Uploading file:", fileName);

  const { data, error } = await supabase.storage
    .from("Kokan_bucket") 
    .upload(fileName, file, {
      cacheControl: "3600",
    });

  if (error) {
    console.error("Error uploading file:", error);
    throw new Error("Image upload failed!!!");
  }

  console.log("Upload response data:", data);

  const { data: publicData } = supabase.storage
    .from("Kokan_bucket")
    .getPublicUrl(data.path);

  if (!publicData.publicUrl) {
    console.error("Error generating public URL");
    console.log("Attempting to generate Signed URL as fallback...");
    const { data: signedData, error: signedError } = await supabase.storage
      .from("Kokan_bucket")
      .createSignedUrl(data.path, 60 * 60);

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
