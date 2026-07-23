/**
 * Sierra Estates 3.0 TypeScript Type Definitions
 */

export type ListingStatus = 'draft' | 'active' | 'sold';
export type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'twin_house' | 'penthouse' | 'duplex' | 'studio';
export type FinishingLevel = 'core_shell' | 'semi' | 'fully_finished' | 'ultra_lux';
export type DeliveryStatus = 'ready' | 'under_construction' | 'off_plan';
export type ListingMode = 'sale' | 'rent';
export type RequestStatus = 'bot_handling' | 'ready_for_agent' | 'closed';

export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  interest: string;
  stage: "Viewing Scheduled" | "AI Matched" | "Contract Draft" | "Initial Contact" | "Negotiating";
  color: string;
  hot: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId?: string;
  archived?: boolean;
}

export interface Listing {
  id: string;
  status: ListingStatus;
  property_type: PropertyType;
  compound_name: string;
  location_sector: string;
  price_egp: number;
  area_sqm: number;
  bedrooms: number;
  bathrooms?: number;
  finishing: FinishingLevel;
  mode: ListingMode;
  delivery_status: DeliveryStatus;
  payment_plan?: string;
  virtual_tour_url?: string;
  code?: string;
  cmp?: string;
  price?: string;
  ai?: number;
  img?: number | string;
  publishToClient?: boolean;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export type ListingInput = Omit<Listing, 'id' | 'created_at' | 'updated_at'>;

export interface Owner {
  id: string;
  owner_name: string;
  phone_number: string;
  email?: string;
  source_type: 'direct' | 'broker';
  broker_name?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export type OwnerInput = Omit<Owner, 'id' | 'created_at' | 'updated_at'>;

export interface CreateListingWithOwnerPayload {
  listing: ListingInput;
  owner: OwnerInput;
}

export interface ChatMessage {
  id?: string;
  sender: 'client' | 'bot' | 'agent' | 'ai' | 'user';
  text: string;
  timestamp: string | Date;
}

export interface Request {
  id: string;
  client_id: string;
  status: RequestStatus;
  assigned_agent_id?: string;
  bot_chat_history: ChatMessage[];
  matched_listings: string[];
  client_needs: {
    intent?: string;
    preferred_zones?: string[];
    preferred_compounds?: string[];
    min_bedrooms?: number;
    max_budget_egp?: number;
    min_area_sqm?: number;
    finishing?: string;
    delivery_status?: string;
    notes?: string;
  };
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export type RequestInput = Omit<Request, 'id' | 'created_at' | 'updated_at'>;

export interface Client {
  id: string;
  name: string;
  phone_number: string;
  email?: string;
  status?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export type ClientInput = Omit<Client, 'id' | 'created_at' | 'updated_at'>;

export interface Agent {
  id: string;
  name: string;
  email?: string;
  desc?: string;
  emoji?: string;
  color?: string;
  status?: "Online" | "Running" | "Idle";
  load?: number;
  tasks?: number;
  is_active?: boolean;
  updatedAt?: Date;
}

export type AgentInput = Omit<Agent, 'id'>;

export interface Workflow {
  id: string;
  name: string;
  nameAr?: string;
  desc?: string;
  descAr?: string;
  status: "active" | "warning" | "paused";
  runs: number;
  last: string;
  color: string;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "Admin" | "Superadmin";
  status?: "approved" | "pending";
  createdAt: Date;
}

export interface SierraNotification {
  id: string;
  type: "lead" | "listing" | "error" | "system";
  title: string;
  titleAr?: string;
  message: string;
  messageAr?: string;
  read: boolean;
  createdAt: Date;
}

export const COLLECTIONS = {
  LISTINGS: 'listings',
  OWNERS: 'owners',
  CLIENTS: 'clients',
  REQUESTS: 'requests',
  AGENTS: 'agents',
} as const;
