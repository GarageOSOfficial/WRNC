/**
 * Hand-maintained mirror of the Supabase schema (see supabase/migrations).
 * Regenerate with `supabase gen types typescript` once a live project is linked.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          workspace_id: string;
          vin: string | null;
          year: number;
          make: string;
          model: string;
          trim: string | null;
          nickname: string | null;
          engine: string | null;
          transmission: string | null;
          mileage: number | null;
          cover_photo_url: string | null;
          archived_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          vin?: string | null;
          year: number;
          make: string;
          model: string;
          trim?: string | null;
          nickname?: string | null;
          engine?: string | null;
          transmission?: string | null;
          mileage?: number | null;
          cover_photo_url?: string | null;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          vin?: string | null;
          year?: number;
          make?: string;
          model?: string;
          trim?: string | null;
          nickname?: string | null;
          engine?: string | null;
          transmission?: string | null;
          mileage?: number | null;
          cover_photo_url?: string | null;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          vehicle_id: string;
          user_id: string;
          activity_type: string;
          title: string;
          description: string | null;
          activity_date: string;
          created_at: string;
          updated_at: string | null;
          photos: string[];
          attachments: string[];
          metadata: Json | null;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          user_id: string;
          activity_type: string;
          title: string;
          description?: string | null;
          activity_date: string;
          created_at?: string;
          updated_at?: string | null;
          photos?: string[];
          attachments?: string[];
          metadata?: Json | null;
          archived_at?: string | null;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          user_id?: string;
          activity_type?: string;
          title?: string;
          description?: string | null;
          activity_date?: string;
          created_at?: string;
          updated_at?: string | null;
          photos?: string[];
          attachments?: string[];
          metadata?: Json | null;
          archived_at?: string | null;
        };
      };
    };
  };
}
