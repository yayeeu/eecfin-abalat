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
          children_names: string | null
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
          children_names?: string | null
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
          children_names?: string | null
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
          contact_email: string
          contact_name: string
          contact_person_id: string | null
          contact_phone: string | null
          created_at: string | null
          description: string
          id: string
          name: string
          photo: string | null
          status: string
        }
        Insert: {
          contact_email: string
          contact_name: string
          contact_person_id?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description: string
          id?: string
          name: string
          photo?: string | null
          status: string
        }
        Update: {
          contact_email?: string
          contact_name?: string
          contact_person_id?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          photo?: string | null
          status?: string
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
