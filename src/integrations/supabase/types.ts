export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
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
          additional_image_urls: string[] | null
          application_deadline: string | null
          attached_links: string | null
          cause_area: string | null
          city: string | null
          created_at: string | null
          date: string
          description: string
          end_date: string | null
          end_time: string | null
          id: string
          image_url: string | null
          location: string
          nonprofit_id: string
          signup_form_url: string | null
          start_time: string | null
          state: string | null
          title: string
          zip: string | null
        }
        Insert: {
          additional_image_urls?: string[] | null
          application_deadline?: string | null
          attached_links?: string | null
          cause_area?: string | null
          city?: string | null
          created_at?: string | null
          date: string
          description: string
          end_date?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          location: string
          nonprofit_id: string
          signup_form_url?: string | null
          start_time?: string | null
          state?: string | null
          title: string
          zip?: string | null
        }
        Update: {
          additional_image_urls?: string[] | null
          application_deadline?: string | null
          attached_links?: string | null
          cause_area?: string | null
          city?: string | null
          created_at?: string | null
          date?: string
          description?: string
          end_date?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          location?: string
          nonprofit_id?: string
          signup_form_url?: string | null
          start_time?: string | null
          state?: string | null
          title?: string
          zip?: string | null
        }
        Relationships: []
      }
      nonprofit_causes: {
        Row: {
          cause_id: string
          nonprofit_id: string
        }
        Insert: {
          cause_id: string
          nonprofit_id: string
        }
        Update: {
          cause_id?: string
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
          banner_image_url: string | null
          created_at: string | null
          description: string
          email: string
          id: string
          location: string
          mission: string
          organization_name: string
          phone: string | null
          profile_image_url: string | null
          social_media: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          banner_image_url?: string | null
          created_at?: string | null
          description: string
          email: string
          id: string
          location: string
          mission: string
          organization_name: string
          phone?: string | null
          profile_image_url?: string | null
          social_media?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          banner_image_url?: string | null
          created_at?: string | null
          description?: string
          email?: string
          id?: string
          location?: string
          mission?: string
          organization_name?: string
          phone?: string | null
          profile_image_url?: string | null
          social_media?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          anonymous_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          nonprofit_id: string | null
          rating: number
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          nonprofit_id?: string | null
          rating: number
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          nonprofit_id?: string | null
          rating?: number
          user_id?: string | null
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
      user_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission: Database["public"]["Enums"]["app_permission"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission: Database["public"]["Enums"]["app_permission"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission?: Database["public"]["Enums"]["app_permission"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_event: {
        Args: { user_id: string; event_id: string }
        Returns: boolean
      }
      get_columns_for_table: {
        Args: { table_name: string }
        Returns: {
          column_name: string
          data_type: string
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_permission: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_permission: ["admin", "user"],
    },
  },
} as const
