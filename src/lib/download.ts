import { auth } from '../firebase';

export interface DownloadResult {
  downloadUrl: string;
  productTitle: string;
}

export async function requestDownloadUrl(productId: string): Promise<DownloadResult> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be signed in to download');
  }

  const token = await user.getIdToken();
  const res = await fetch('/api/download-product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to get download URL');
  }

  return data;
}

export function triggerDownload(url: string, filename?: string) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  if (filename) {
    link.download = filename;
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function secureDownload(productId: string, filename?: string) {
  const { downloadUrl } = await requestDownloadUrl(productId);
  triggerDownload(downloadUrl, filename);
}
