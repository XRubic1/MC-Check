/**
 * MC Verification record as stored in Supabase and used in the app.
 */
export interface MCVerification {
  id: string;
  mc_number: string;
  carrier: string;
  amount: number;
  approved: boolean;
  entered_by: string;
  notes: string | null;
  date_entered: string; // ISO date YYYY-MM-DD
  created_at: string;
}

/**
 * Form payload for creating a new MC verification (no id, created_at).
 */
export interface MCVerificationInsert {
  mc_number: string;
  carrier: string;
  amount: number;
  approved: boolean;
  entered_by: string;
  notes: string | null;
  date_entered: string; // ISO date YYYY-MM-DD
}

/**
 * Payload for updating an existing MC verification (all fields optional except id).
 */
export interface MCVerificationUpdate {
  mc_number?: string;
  carrier?: string;
  amount?: number;
  approved?: boolean;
  entered_by?: string;
  notes?: string | null;
  date_entered?: string;
}
