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
      posts: {
        Row: {
          created_at: string;
          id: string;
          image_url: string | null;
          is_published: boolean | null;
          poem_content: string | null;
          published_by_user: string;
          published_by_uuid: string | null;
          subtitle: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          is_published?: boolean | null;
          poem_content?: string | null;
          published_by_user: string;
          published_by_uuid?: string | null;
          subtitle?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          is_published?: boolean | null;
          poem_content?: string | null;
          published_by_user?: string;
          published_by_uuid?: string | null;
          subtitle?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "posts_published_by_uuid_fkey";
            columns: ["published_by_uuid"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
