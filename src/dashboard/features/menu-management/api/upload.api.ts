import { supabase } from '@shared/lib/supabase';

/**
 * Uploads an image file to Supabase Storage and returns the public URL.
 *
 * @param file The image file to upload
 * @returns The public URL of the uploaded image
 */
export const uploadImage = async (file: File): Promise<string> => {
  // Generate a unique filename using timestamp and a random string
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to Supabase 'menu-images' bucket
  const { error } = await supabase.storage.from('menu-images').upload(filePath, file);

  if (error) {
    console.error('Error uploading image to Supabase:', error);
    throw new Error(`Gagal mengunggah gambar: ${error.message}`);
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage.from('menu-images').getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
