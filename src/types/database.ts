/**
 * Supabase generated types for MC-Check tables.
 * Adjust to match your actual schema if you use Supabase codegen.
 */
export interface Database {
  public: {
    Tables: {
      mc_verifications: {
        Row: {
          id: string;
          mc_number: string;
          carrier: string;
          amount: number;
          approved: boolean;
          entered_by: string;
          notes: string | null;
          date_entered: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          mc_number: string;
          carrier: string;
          amount: number;
          approved: boolean;
          entered_by: string;
          notes?: string | null;
          date_entered: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['mc_verifications']['Insert']>;
      };
    };
  };
}
