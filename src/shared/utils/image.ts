/**
 * Helper to get optimized image URL from Supabase Storage.
 * If the URL is from Supabase, it will convert `/object/public/` to `/render/image/public/`
 * and append resize parameters to optimize loading performance.
 */
export const getOptimizedImageUrl = (
  url: string | null | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    resize?: 'cover' | 'contain' | 'fill';
  } = {},
): string => {
  if (!url) return '';

  // Check if it's a Supabase storage URL
  if (url.includes('/storage/v1/object/public/')) {
    const { width, height, quality = 80, resize = 'cover' } = options;

    // Replace /object/ with /render/image/
    const optimizedUrl = url.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/',
    );

    const params = new URLSearchParams();
    if (width) params.append('width', width.toString());
    if (height) params.append('height', height.toString());
    params.append('quality', quality.toString());
    params.append('resize', resize);

    // Request webp format for better compression and web performance
    params.append('format', 'webp');

    const separator = optimizedUrl.includes('?') ? '&' : '?';
    return `${optimizedUrl}${separator}${params.toString()}`;
  }

  return url;
};
