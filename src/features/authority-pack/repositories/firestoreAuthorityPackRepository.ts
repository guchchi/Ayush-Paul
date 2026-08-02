import { IAuthorityPackRepository } from './index';
import { AuthorityPackDomain, PackStatus } from '../types';
import { db, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from '../../../firebase';

export class FirestoreAuthorityPackRepository implements IAuthorityPackRepository {
  private collectionName = 'authority_packs';

  async get(id: string): Promise<AuthorityPackDomain | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as AuthorityPackDomain;
    } catch (err) {
      console.warn(`[FirestoreAuthorityPackRepository] Falling back to local state (Firestore read skipped/failed):`, err);
      return null;
    }
  }

  async save(pack: AuthorityPackDomain): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, pack.id);
      await setDoc(docRef, {
        ...pack,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn(`[FirestoreAuthorityPackRepository] Could not save pack to Firestore (unauthenticated or permission restricted):`, err);
    }
  }

  async updateStatus(id: string, status: PackStatus): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn(`[FirestoreAuthorityPackRepository] Could not update status in Firestore (unauthenticated or permission restricted):`, err);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn(`[FirestoreAuthorityPackRepository] Could not delete pack in Firestore:`, err);
    }
  }
}
