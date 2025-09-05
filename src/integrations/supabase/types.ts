export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      anonymous_comments: {
        Row: {
          author_nickname: string | null
          content: string
          created_at: string
          id: string
          is_deleted: boolean | null
          password_hash: string
          post_id: string
        }
        Insert: {
          author_nickname?: string | null
          content: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          password_hash: string
          post_id: string
        }
        Update: {
          author_nickname?: string | null
          content?: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          password_hash?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "anonymous_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "anonymous_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anonymous_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "anonymous_posts_public"
            referencedColumns: ["id"]
          },
        ]
      }
      anonymous_posts: {
        Row: {
          author_nickname: string | null
          comment_count: number | null
          content: string
          created_at: string
          id: string
          is_deleted: boolean | null
          like_count: number | null
          password_hash: string
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_nickname?: string | null
          comment_count?: number | null
          content: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          like_count?: number | null
          password_hash: string
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_nickname?: string | null
          comment_count?: number | null
          content?: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          like_count?: number | null
          password_hash?: string
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emotion_logs: {
        Row: {
          created_at: string
          emotion: string
          id: string
          intensity: number | null
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          emotion: string
          id?: string
          intensity?: number | null
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          emotion?: string
          id?: string
          intensity?: number | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          emotion_detected: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          emotion_detected?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          emotion_detected?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          building: string
          car_number: string | null
          created_at: string
          dept: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
          work_area: string | null
        }
        Insert: {
          building: string
          car_number?: string | null
          created_at?: string
          dept: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
          work_area?: string | null
        }
        Update: {
          building?: string
          car_number?: string | null
          created_at?: string
          dept?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          work_area?: string | null
        }
        Relationships: []
      }
      requests: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          metadata: Json | null
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          status?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      work_areas: {
        Row: {
          building: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          building: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          building?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      anonymous_comments_public: {
        Row: {
          author_nickname: string | null
          content: string | null
          created_at: string | null
          id: string | null
          is_deleted: boolean | null
          post_id: string | null
        }
        Insert: {
          author_nickname?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_deleted?: boolean | null
          post_id?: string | null
        }
        Update: {
          author_nickname?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_deleted?: boolean | null
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anonymous_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "anonymous_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anonymous_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "anonymous_posts_public"
            referencedColumns: ["id"]
          },
        ]
      }
      anonymous_posts_public: {
        Row: {
          author_nickname: string | null
          comment_count: number | null
          content: string | null
          created_at: string | null
          id: string | null
          is_deleted: boolean | null
          like_count: number | null
          title: string | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_nickname?: string | null
          comment_count?: number | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_deleted?: boolean | null
          like_count?: number | null
          title?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_nickname?: string | null
          comment_count?: number | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_deleted?: boolean | null
          like_count?: number | null
          title?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      handle_google_calendar_auth: {
        Args: { request_body: Json }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_like_count: {
        Args: { post_id: string }
        Returns: undefined
      }
      increment_view_count: {
        Args: { post_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
