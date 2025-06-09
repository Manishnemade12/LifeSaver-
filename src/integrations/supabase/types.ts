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
      anonymous_reports: {
        Row: {
          created_at: string | null
          description: string
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          priority: string | null
          resolution_message: string | null
          responded_at: string | null
          responder_id: string | null
          status: string
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          priority?: string | null
          resolution_message?: string | null
          responded_at?: string | null
          responder_id?: string | null
          status?: string
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          priority?: string | null
          resolution_message?: string | null
          responded_at?: string | null
          responder_id?: string | null
          status?: string
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      emergency_alerts: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          location_description: string | null
          location_lat: number | null
          location_lng: number | null
          responder_id: string | null
          status: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          location_description?: string | null
          location_lat?: number | null
          location_lng?: number | null
          responder_id?: string | null
          status?: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          location_description?: string | null
          location_lat?: number | null
          location_lng?: number | null
          responder_id?: string | null
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_alerts_responder_id_fkey"
            columns: ["responder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          id: string
          name: string
          phone: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          phone: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          phone?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_details: {
        Row: {
          address: string
          bed_capacity: number | null
          created_at: string | null
          emergency_contact: string | null
          hospital_id: string | null
          hospital_name: string
          id: string
          is_emergency_ready: boolean | null
          latitude: number | null
          longitude: number | null
          phone: string | null
          specializations: string[] | null
          updated_at: string | null
        }
        Insert: {
          address: string
          bed_capacity?: number | null
          created_at?: string | null
          emergency_contact?: string | null
          hospital_id?: string | null
          hospital_name: string
          id?: string
          is_emergency_ready?: boolean | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          specializations?: string[] | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          bed_capacity?: number | null
          created_at?: string | null
          emergency_contact?: string | null
          hospital_id?: string | null
          hospital_name?: string
          id?: string
          is_emergency_ready?: boolean | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          specializations?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospital_details_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      responder_details: {
        Row: {
          badge_id: string
          created_at: string | null
          current_location: unknown | null
          id: string
          is_on_duty: boolean | null
          is_verified: boolean | null
          responder_type: string
          updated_at: string | null
        }
        Insert: {
          badge_id: string
          created_at?: string | null
          current_location?: unknown | null
          id: string
          is_on_duty?: boolean | null
          is_verified?: boolean | null
          responder_type: string
          updated_at?: string | null
        }
        Update: {
          badge_id?: string
          created_at?: string | null
          current_location?: unknown | null
          id?: string
          is_on_duty?: boolean | null
          is_verified?: boolean | null
          responder_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responder_details_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sos_requests: {
        Row: {
          created_at: string
          description: string | null
          emergency_type: string
          id: string
          latitude: number
          longitude: number
          status: string
          updated_at: string | null
          user_name: string
          user_phone: string
          responder_hospital_id: string | null

        }
        Insert: {
          created_at?: string
          description?: string | null
          emergency_type: string
          id?: string
          latitude: number
          longitude: number
          status?: string
          updated_at?: string | null
          user_name: string
          user_phone: string
        }
        Update: {
          created_at?: string
          description?: string | null
          emergency_type?: string
          id?: string
          latitude?: number
          longitude?: number
          status?: string
          updated_at?: string | null
          user_name?: string
          user_phone?: string
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
