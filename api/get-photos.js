import { list } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const { blobs } = await list();

    const photos = blobs
      .filter((blob) => blob.pathname.match(/\.(png|jpg|jpeg|webp|gif)$/i))
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .map((blob) => ({
        key: blob.pathname,
        url: blob.url
      }));

    return res.status(200).json({ photos });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}