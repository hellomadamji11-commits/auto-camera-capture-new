import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData } = req.body;

    if (!imageData || !imageData.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image data' });
    }

    const match = imageData.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid image encoding' });
    }

    const [, contentType, base64Data] = match;
    const buffer = Buffer.from(base64Data, 'base64');
    const extension = contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
    const filename = `photo-${Date.now()}.${extension}`;

    const blob = await put(filename, buffer, {
      access: 'Public',
      contentType
    });

    return res.status(200).json({
      success: true,
      url: blob.url,
      pathname: blob.pathname
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}