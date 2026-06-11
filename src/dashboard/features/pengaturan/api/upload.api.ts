import { supabase } from '@shared/lib/supabase';

/**
 * Uploads an avatar image file to Supabase Storage in 'avatar-images' bucket and returns the public URL.
 *
 * @param file The image file to upload
 * @returns The public URL of the uploaded image
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  // Generate a unique filename using timestamp and a random string
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to Supabase 'avatar-images' bucket
  const { error } = await supabase.storage.from('avatar-images').upload(filePath, file);

  if (error) {
    console.error('Error uploading avatar to Supabase:', error);
    throw new Error(`Gagal mengunggah avatar: ${error.message}`);
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage.from('avatar-images').getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
