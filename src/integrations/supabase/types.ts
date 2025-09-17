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
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          duration_minutes: number
          id: string
          notes: string | null
          provider_name: string
          provider_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          provider_name: string
          provider_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          provider_name?: string
          provider_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_user: boolean
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_user: boolean
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_user?: boolean
          message?: string
          user_id?: string
        }
        Relationships: []
      }
      consent_forms: {
        Row: {
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          form_type: string
          id: string
          relationship: string | null
          signature_data: string | null
          signed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          form_type: string
          id?: string
          relationship?: string | null
          signature_data?: string | null
          signed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          form_type?: string
          id?: string
          relationship?: string | null
          signature_data?: string | null
          signed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_check_ins: {
        Row: {
          coping_strategies: string[] | null
          cravings: number | null
          created_at: string
          date: string
          exercise_minutes: number | null
          id: string
          mood: number | null
          notes: string | null
          sleep_hours: number | null
          stress: number | null
          triggers: string[] | null
          user_id: string
        }
        Insert: {
          coping_strategies?: string[] | null
          cravings?: number | null
          created_at?: string
          date?: string
          exercise_minutes?: number | null
          id?: string
          mood?: number | null
          notes?: string | null
          sleep_hours?: number | null
          stress?: number | null
          triggers?: string[] | null
          user_id: string
        }
        Update: {
          coping_strategies?: string[] | null
          cravings?: number | null
          created_at?: string
          date?: string
          exercise_minutes?: number | null
          id?: string
          mood?: number | null
          notes?: string | null
          sleep_hours?: number | null
          stress?: number | null
          triggers?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          id: string
          phone: string | null
          recovery_start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          recovery_start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          recovery_start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      risk_assessments: {
        Row: {
          created_at: string
          id: string
          responses: Json
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          responses: Json
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          responses?: Json
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      stress_assessments: {
        Row: {
          coping_mechanisms: string | null
          created_at: string
          emotional_symptoms: string[] | null
          exercise_frequency: number
          financial_stress: number
          health_concerns: number
          id: string
          physical_symptoms: string[] | null
          recommendations: string[]
          relationship_stress: number
          sleep_hours: number
          social_support: number
          stress_category: string
          stress_level: number
          stress_triggers: string | null
          total_score: number
          updated_at: string
          user_id: string
          work_pressure: number
        }
        Insert: {
          coping_mechanisms?: string | null
          created_at?: string
          emotional_symptoms?: string[] | null
          exercise_frequency: number
          financial_stress: number
          health_concerns: number
          id?: string
          physical_symptoms?: string[] | null
          recommendations?: string[]
          relationship_stress: number
          sleep_hours: number
          social_support: number
          stress_category: string
          stress_level: number
          stress_triggers?: string | null
          total_score: number
          updated_at?: string
          user_id: string
          work_pressure: number
        }
        Update: {
          coping_mechanisms?: string | null
          created_at?: string
          emotional_symptoms?: string[] | null
          exercise_frequency?: number
          financial_stress?: number
          health_concerns?: number
          id?: string
          physical_symptoms?: string[] | null
          recommendations?: string[]
          relationship_stress?: number
          sleep_hours?: number
          social_support?: number
          stress_category?: string
          stress_level?: number
          stress_triggers?: string | null
          total_score?: number
          updated_at?: string
          user_id?: string
          work_pressure?: number
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
    Enums: {},
  },
} as const
