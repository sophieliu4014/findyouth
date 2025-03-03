export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      causes: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          date: string
          description: string
          end_date: string | null
          id: string
          image_url: string | null
          location: string
          nonprofit_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          location: string
          nonprofit_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          location?: string
          nonprofit_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_nonprofit_id_fkey"
            columns: ["nonprofit_id"]
            isOneToOne: false
            referencedRelation: "nonprofits"
            referencedColumns: ["id"]
          },
        ]
      }
      Feedback: {
        Row: {}
        Insert: {}
        Update: {}
        Relationships: []
      }
      nonprofit_causes: {
        Row: {
          cause_id: string
          id: string
          nonprofit_id: string
        }
        Insert: {
          cause_id: string
          id?: string
          nonprofit_id: string
        }
        Update: {
          cause_id?: string
          id?: string
          nonprofit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nonprofit_causes_cause_id_fkey"
            columns: ["cause_id"]
            isOneToOne: false
            referencedRelation: "causes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nonprofit_causes_nonprofit_id_fkey"
            columns: ["nonprofit_id"]
            isOneToOne: false
            referencedRelation: "nonprofits"
            referencedColumns: ["id"]
          },
        ]
      }
      nonprofits: {
        Row: {
          auth_id: string | null
          created_at: string | null
          description: string
          email: string
          id: string
          is_approved: boolean | null
          location: string
          mission: string
          organization_name: string
          phone: string
          profile_image_url: string | null
          social_media: string
          website: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          description: string
          email: string
          id?: string
          is_approved?: boolean | null
          location: string
          mission: string
          organization_name: string
          phone: string
          profile_image_url?: string | null
          social_media: string
          website?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          description?: string
          email?: string
          id?: string
          is_approved?: boolean | null
          location?: string
          mission?: string
          organization_name?: string
          phone?: string
          profile_image_url?: string | null
          social_media?: string
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          nonprofit_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          nonprofit_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          nonprofit_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_nonprofit_id_fkey"
            columns: ["nonprofit_id"]
            isOneToOne: false
            referencedRelation: "nonprofits"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_columns_for_table: {
        Args: {
          table_name: string
        }
        Returns: {
          column_name: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
