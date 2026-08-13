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

export type ActivityType =
  | 'purchased_part'
  | 'installed_part'
  | 'maintenance'
  | 'progress_update'
  | 'journal_entry'
  | 'record_upload';

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
          type: ActivityType | null;
          title: string;
          notes: string | null;
          metadata: Json | null;
          occurred_at: string;
          archived_at: string | null;
          created_at: string;
          updated_at: string | null;
          user_id: string;
          activity_type: string;
          description: string | null;
          activity_date: string;
          photos: string[];
          attachments: string[];
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          type?: ActivityType | null;
          title?: string;
          notes?: string | null;
          metadata?: Json | null;
          occurred_at?: string;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string | null;
          user_id: string;
          activity_type: string;
          description?: string | null;
          activity_date: string;
          photos?: string[];
          attachments?: string[];
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          type?: ActivityType | null;
          title?: string;
          notes?: string | null;
          metadata?: Json | null;
          occurred_at?: string;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string | null;
          user_id?: string;
          activity_type?: string;
          description?: string | null;
          activity_date?: string;
          photos?: string[];
          attachments?: string[];
        };
      };
      documents: {
        Row: {
          id: string;
          workspace_id: string;
          vehicle_id: string | null;
          activity_id: string | null;
          document_type: string;
          title: string;
          description: string | null;
          file_url: string | null;
          file_path: string;
          thumbnail_url: string | null;
          mime_type: string;
          file_size: number;
          uploaded_by: string;
          uploaded_at: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          vehicle_id?: string | null;
          activity_id?: string | null;
          document_type: string;
          title: string;
          description?: string | null;
          file_url?: string | null;
          file_path: string;
          thumbnail_url?: string | null;
          mime_type: string;
          file_size: number;
          uploaded_by: string;
          uploaded_at?: string;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          vehicle_id?: string | null;
          activity_id?: string | null;
          document_type?: string;
          title?: string;
          description?: string | null;
          file_url?: string | null;
          file_path?: string;
          thumbnail_url?: string | null;
          mime_type?: string;
          file_size?: number;
          uploaded_by?: string;
          uploaded_at?: string;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
    };
  };
}
