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
      contact_log: {
        Row: {
          contact_type: string
          created_at: string | null
          elder_id: string
          flagged: boolean | null
          id: string
          member_id: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          contact_type: string
          created_at?: string | null
          elder_id: string
          flagged?: boolean | null
          id?: string
          member_id: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_type?: string
          created_at?: string | null
          elder_id?: string
          flagged?: boolean | null
          id?: string
          member_id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_log_elder_id_fkey"
            columns: ["elder_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_log_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_ministry: {
        Row: {
          created_at: string | null
          id: string
          member_id: string
          ministry_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          member_id: string
          ministry_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          member_id?: string
          ministry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_ministry_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_ministry_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
      member_type: {
        Row: {
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      member_under_elder: {
        Row: {
          created_at: string | null
          elder_id: string
          id: string
          member_id: string
        }
        Insert: {
          created_at?: string | null
          elder_id: string
          id?: string
          member_id: string
        }
        Update: {
          created_at?: string | null
          elder_id?: string
          id?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_under_elder_elder_id_fkey"
            columns: ["elder_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_under_elder_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: true
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address: string | null
          children_names: number | null
          city: string | null
          created_at: string
          email: string | null
          emergency_contact: string | null
          gender: string | null
          has_letter_from_prev_church: boolean | null
          id: string
          image: string | null
          is_baptised: boolean | null
          latitude: number | null
          longitude: number | null
          marital_status: string | null
          member_type_id: string | null
          ministry_id: string | null
          name: string | null
          num_children: number | null
          phone: string | null
          postal_code: string | null
          previous_church: string | null
          role_id: string | null
          role_in_previous_church: string | null
          spouse_name: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          children_names?: number | null
          city?: string | null
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          gender?: string | null
          has_letter_from_prev_church?: boolean | null
          id?: string
          image?: string | null
          is_baptised?: boolean | null
          latitude?: number | null
          longitude?: number | null
          marital_status?: string | null
          member_type_id?: string | null
          ministry_id?: string | null
          name?: string | null
          num_children?: number | null
          phone?: string | null
          postal_code?: string | null
          previous_church?: string | null
          role_id?: string | null
          role_in_previous_church?: string | null
          spouse_name?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          children_names?: number | null
          city?: string | null
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          gender?: string | null
          has_letter_from_prev_church?: boolean | null
          id?: string
          image?: string | null
          is_baptised?: boolean | null
          latitude?: number | null
          longitude?: number | null
          marital_status?: string | null
          member_type_id?: string | null
          ministry_id?: string | null
          name?: string | null
          num_children?: number | null
          phone?: string | null
          postal_code?: string | null
          previous_church?: string | null
          role_id?: string | null
          role_in_previous_church?: string | null
          spouse_name?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_member_type_id_fkey"
            columns: ["member_type_id"]
            isOneToOne: false
            referencedRelation: "member_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      ministries: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_person_id: string | null
          contact_phone: string | null
          created_at: string | null
          description: string
          id: string
          name: string
          photo: string | null
          status: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_person_id?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description: string
          id?: string
          name: string
          photo?: string | null
          status?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_person_id?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          photo?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ministries_contact_person_id_fkey"
            columns: ["contact_person_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      slides: {
        Row: {
          alt: string
          created_at: string | null
          id: string
          order: number
          src: string
          subtitle: string | null
          title: string | null
        }
        Insert: {
          alt: string
          created_at?: string | null
          id?: string
          order?: number
          src: string
          subtitle?: string | null
          title?: string | null
        }
        Update: {
          alt?: string
          created_at?: string | null
          id?: string
          order?: number
          src?: string
          subtitle?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
