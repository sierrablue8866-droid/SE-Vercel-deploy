/**
 * Admin Firebase Bridge
 * Re-exports everything the legacy admin components need from the central firebase singleton.
 * Original admin components imported from '../firebase' — this file satisfies that path.
 */
'use client';

export { auth, db, storage } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ── OperationType ──────────────────────────────────────────────────────────────
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: { providerId?: string | null; email?: string | null }[];
  };
}

/** Global Firestore error handler wrapping raw errors with diagnostic metadata. */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/** Triggers a real-time notification in Firestore to alert admins. */
export async function createSierraNotification(
  type: 'lead' | 'listing' | 'error' | 'system',
  title: string,
  message: string,
  titleAr?: string,
  messageAr?: string
) {
  try {
    await addDoc(collection(db, 'notifications'), {
      type,
      title,
      message,
      titleAr: titleAr || null,
      messageAr: messageAr || null,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
}
