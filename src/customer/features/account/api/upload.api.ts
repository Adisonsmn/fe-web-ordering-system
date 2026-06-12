import { supabase } from '@shared/lib/supabase';

/**
 * Upload foto avatar ke Supabase bucket 'avatar-images' dan return public URL.
 * Nama file unik berdasarkan timestamp + random string.
 */
export const uploadAvatarCustomer = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `customer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const { error } = await supabase.storage.from('avatar-images').upload(fileName, file, {
    upsert: false,
  });

  if (error) {
    throw new Error(`Gagal mengunggah foto: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from('avatar-images').getPublicUrl(fileName);
  return publicUrlData.publicUrl;
};
