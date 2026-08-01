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
      console.error(`[FirestoreAuthorityPackRepository] Failed to get pack ${id}:`, err);
      throw err;
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
      console.error(`[FirestoreAuthorityPackRepository] Failed to save pack ${pack.id}:`, err);
      throw err;
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
      console.error(`[FirestoreAuthorityPackRepository] Failed to update status for pack ${id}:`, err);
      throw err;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error(`[FirestoreAuthorityPackRepository] Failed to delete pack ${id}:`, err);
      throw err;
    }
  }
}
