/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  Sierra Estates — Firebase CRUD Utilities (Next.js Admin Integration)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  QueryConstraint,
  writeBatch,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import {
  COLLECTIONS,
  Listing,
  ListingInput,
  Owner,
  OwnerInput,
  Client,
  ClientInput,
  Request,
  RequestInput,
  Agent,
  AgentInput,
  CreateListingWithOwnerPayload,
  ListingStatus,
  RequestStatus,
} from '../types';

export enum OperationType {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  CREATE = 'create',
  UPDATE = 'update',
  LIST = 'list',
  GET = 'get',
}

export const handleFirestoreError = (e: any) => ({ success: false, error: String(e) });

/* ═══════════════════════════════════════════════════════════════════════════
 *  LISTINGS CRUD
 * ═══════════════════════════════════════════════════════════════════════════ */

export async function fetchListings(opts?: {
  status?: ListingStatus;
  mode?: 'sale' | 'rent';
  compound?: string;
  limitCount?: number;
}): Promise<Listing[]> {
  try {
    const constraints: QueryConstraint[] = [];
    if (opts?.status) constraints.push(where('status', '==', opts.status));
    if (opts?.mode) constraints.push(where('mode', '==', opts.mode));
    if (opts?.compound) constraints.push(where('compound_name', '==', opts.compound));
    constraints.push(orderBy('created_at', 'desc'));
    if (opts?.limitCount) constraints.push(limit(opts.limitCount));

    const q = query(collection(db, COLLECTIONS.LISTINGS), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Listing);
  } catch (err) {
    console.warn('fetchListings fallback:', err);
    return [];
  }
}

export async function fetchListingById(id: string): Promise<Listing | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.LISTINGS, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Listing;
}

export async function createListing(data: ListingInput): Promise<Listing> {
  const ref = await addDoc(collection(db, COLLECTIONS.LISTINGS), {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return (await fetchListingById(ref.id))!;
}

export async function updateListing(
  id: string,
  patch: Partial<ListingInput>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.LISTINGS, id), {
    ...patch,
    updated_at: serverTimestamp(),
  });
}

export async function deleteListing(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.LISTINGS, id));
}

export async function setListingStatus(
  id: string,
  status: ListingStatus
): Promise<void> {
  await updateListing(id, { status });
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  ATOMIC LISTING + OWNER CREATION
 * ═══════════════════════════════════════════════════════════════════════════ */

export async function createListingWithOwner(
  payload: CreateListingWithOwnerPayload
): Promise<{ listingId: string; ownerId: string }> {
  const batch = writeBatch(db);

  const listingRef = doc(collection(db, COLLECTIONS.LISTINGS));
  const listingId = listingRef.id;
  const ownerRef = doc(db, COLLECTIONS.OWNERS, listingId);

  const now = serverTimestamp();

  batch.set(listingRef, {
    ...payload.listing,
    created_at: now,
    updated_at: now,
  });

  batch.set(ownerRef, {
    ...payload.owner,
    created_at: now,
    updated_at: now,
  });

  await batch.commit();
  return { listingId, ownerId: listingId };
}

export async function updateListingAndOwner(
  listingId: string,
  listingPatch: Partial<ListingInput>,
  ownerPatch: Partial<OwnerInput>
): Promise<void> {
  const batch = writeBatch(db);
  const now = serverTimestamp();

  batch.update(doc(db, COLLECTIONS.LISTINGS, listingId), {
    ...listingPatch,
    updated_at: now,
  });
  batch.update(doc(db, COLLECTIONS.OWNERS, listingId), {
    ...ownerPatch,
    updated_at: now,
  });

  await batch.commit();
}

export async function deleteListingAndOwner(listingId: string): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(doc(db, COLLECTIONS.LISTINGS, listingId));
  batch.delete(doc(db, COLLECTIONS.OWNERS, listingId));
  await batch.commit();
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  OWNERS CRUD
 * ═══════════════════════════════════════════════════════════════════════════ */

export async function fetchOwnerByListingId(
  listingId: string
): Promise<Owner | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.OWNERS, listingId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Owner;
}

export async function fetchAllOwners(limitCount = 100): Promise<Owner[]> {
  const q = query(
    collection(db, COLLECTIONS.OWNERS),
    orderBy('created_at', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Owner);
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  REQUESTS CRUD (Workflow Tickets)
 * ═══════════════════════════════════════════════════════════════════════════ */

export async function fetchRequests(opts?: {
  status?: RequestStatus;
  assignedAgentId?: string;
  clientId?: string;
  limitCount?: number;
}): Promise<Request[]> {
  try {
    const constraints: QueryConstraint[] = [];
    if (opts?.status) constraints.push(where('status', '==', opts.status));
    if (opts?.assignedAgentId)
      constraints.push(where('assigned_agent_id', '==', opts.assignedAgentId));
    if (opts?.clientId)
      constraints.push(where('client_id', '==', opts.clientId));
    constraints.push(orderBy('created_at', 'desc'));
    if (opts?.limitCount) constraints.push(limit(opts.limitCount));

    const q = query(collection(db, COLLECTIONS.REQUESTS), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Request);
  } catch (err) {
    console.warn('fetchRequests fallback:', err);
    return [];
  }
}

export async function fetchRequestById(id: string): Promise<Request | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.REQUESTS, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Request;
}

export async function createRequest(data: RequestInput): Promise<Request> {
  const ref = await addDoc(collection(db, COLLECTIONS.REQUESTS), {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() } as Request;
}

export async function updateRequest(
  id: string,
  patch: Partial<RequestInput>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.REQUESTS, id), {
    ...patch,
    updated_at: serverTimestamp(),
  });
}

export async function appendChatMessage(
  requestId: string,
  message: { sender: 'client' | 'bot' | 'agent'; text: string; timestamp: string }
): Promise<void> {
  const ref = doc(db, COLLECTIONS.REQUESTS, requestId);
  await updateDoc(ref, {
    bot_chat_history: arrayUnion(message),
    updated_at: serverTimestamp(),
  });
}

export async function escalateToAgent(
  requestId: string,
  agentId: string
): Promise<void> {
  await updateRequest(requestId, {
    status: 'ready_for_agent',
    assigned_agent_id: agentId,
  });
}

export async function closeRequest(requestId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.REQUESTS, requestId), {
    status: 'closed',
    closed_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
}

export async function deleteRequest(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.REQUESTS, id));
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  CLIENTS CRUD
 * ═══════════════════════════════════════════════════════════════════════════ */

export async function fetchClients(limitCount = 100): Promise<Client[]> {
  const q = query(
    collection(db, COLLECTIONS.CLIENTS),
    orderBy('created_at', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Client);
}

export async function fetchClientById(id: string): Promise<Client | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.CLIENTS, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Client;
}

export async function fetchClientByPhone(
  phoneNumber: string
): Promise<Client | null> {
  const q = query(
    collection(db, COLLECTIONS.CLIENTS),
    where('phone_number', '==', phoneNumber),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Client;
}

export async function createClient(data: ClientInput): Promise<Client> {
  const ref = await addDoc(collection(db, COLLECTIONS.CLIENTS), {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() } as Client;
}

export async function updateClient(
  id: string,
  patch: Partial<ClientInput>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.CLIENTS, id), {
    ...patch,
    updated_at: serverTimestamp(),
  });
}

export async function deleteClient(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.CLIENTS, id));
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  AGENTS CRUD
 * ═══════════════════════════════════════════════════════════════════════════ */

export async function fetchAgents(): Promise<Agent[]> {
  const q = query(
    collection(db, COLLECTIONS.AGENTS),
    where('is_active', '==', true),
    orderBy('name', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Agent);
}

export async function fetchAgentById(id: string): Promise<Agent | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.AGENTS, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Agent;
}

export async function createAgent(
  uid: string,
  data: AgentInput
): Promise<Agent> {
  await setDoc(doc(db, COLLECTIONS.AGENTS, uid), {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return (await fetchAgentById(uid))!;
}

export async function updateAgent(
  id: string,
  patch: Partial<AgentInput>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.AGENTS, id), {
    ...patch,
    updated_at: serverTimestamp(),
  });
}

export async function deactivateAgent(id: string): Promise<void> {
  await updateAgent(id, { is_active: false });
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  REALTIME LISTENERS
 * ═══════════════════════════════════════════════════════════════════════════ */

export function subscribeToListings(
  callback: (listings: Listing[]) => void,
  statusFilter: ListingStatus = 'active'
): () => void {
  const q = query(
    collection(db, COLLECTIONS.LISTINGS),
    where('status', '==', statusFilter),
    orderBy('created_at', 'desc'),
    limit(50)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Listing));
  });
}

export function subscribeToOpenRequests(
  callback: (requests: Request[]) => void
): () => void {
  const q = query(
    collection(db, COLLECTIONS.REQUESTS),
    where('status', 'in', ['bot_handling', 'ready_for_agent']),
    orderBy('created_at', 'desc'),
    limit(20)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Request));
  });
}

export const FirebaseService = {
  fetchListings,
  fetchListingById,
  createListing,
  updateListing,
  deleteListing,
  setListingStatus,
  createListingWithOwner,
  updateListingAndOwner,
  deleteListingAndOwner,
  fetchOwnerByListingId,
  fetchAllOwners,
  fetchRequests,
  fetchRequestById,
  createRequest,
  updateRequest,
  appendChatMessage,
  escalateToAgent,
  closeRequest,
  deleteRequest,
  fetchClients,
  fetchClientById,
  fetchClientByPhone,
  createClient,
  updateClient,
  deleteClient,
  fetchAgents,
  fetchAgentById,
  createAgent,
  updateAgent,
  deactivateAgent,
  subscribeToListings,
  subscribeToOpenRequests,
};

export default FirebaseService;
