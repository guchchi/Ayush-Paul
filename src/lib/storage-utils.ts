import { storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const uploadImage = (
  file: File,
  path: string,
  onProgress?: (p: number) => void
): Promise<{ url: string; fullPath: string }> => {
  return new Promise((resolve, reject) => {
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const r = storageRef(storage, `${path}/${fileName}`);

    const task = uploadBytesResumable(r, file);

    task.on(
      "state_changed",
      (snap) => {
        if (onProgress) onProgress((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, fullPath: task.snapshot.ref.fullPath }); // important for cleanup
      }
    );
  });
};

export const deleteImageByPath = async (fullPath: string) => {
  if (!fullPath) return;
  try {
    await deleteObject(storageRef(storage, fullPath));
  } catch (err) {
    console.error(`Failed to delete storage path ${fullPath}:`, err);
  }
};

export const deleteImageByUrl = async (url: string) => {
  if (!url) return;
  try {
    await deleteObject(storageRef(storage, url));
  } catch (err) {
    console.error(`Failed to delete storage url ${url}:`, err);
  }
};

export function getSafeLocalStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setSafeLocalStorage<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined') return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

