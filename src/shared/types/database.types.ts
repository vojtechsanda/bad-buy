export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4';
  };
  public: {
    Tables: {
      campaign_promo_code: {
        Row: {
          code: string;
          ends_at: string | null;
        };
        Insert: {
          code: string;
          ends_at?: string | null;
        };
        Update: {
          code?: string;
          ends_at?: string | null;
        };
        Relationships: [];
      };
      currency_rate: {
        Row: {
          base: string;
          fetched_at: string;
          id: string;
          rate: number;
          target: string;
        };
        Insert: {
          base: string;
          fetched_at?: string;
          id?: string;
          rate: number;
          target: string;
        };
        Update: {
          base?: string;
          fetched_at?: string;
          id?: string;
          rate?: number;
          target?: string;
        };
        Relationships: [];
      };
      profile: {
        Row: {
          applied_promo_code: string | null;
          avatar_url: string | null;
          birthdate: string | null;
          country: string | null;
          display_currency: string | null;
          hourly_wage_usd: number | null;
          id: string;
          name: string | null;
          notifications_enabled: boolean;
          premium_until: string | null;
          referral_code: string | null;
          referred_by: string | null;
          wage_currency: string | null;
          work_hours_per_day: number | null;
        };
        Insert: {
          applied_promo_code?: string | null;
          avatar_url?: string | null;
          birthdate?: string | null;
          country?: string | null;
          display_currency?: string | null;
          hourly_wage_usd?: number | null;
          id?: string;
          name?: string | null;
          notifications_enabled?: boolean;
          premium_until?: string | null;
          referral_code?: string | null;
          referred_by?: string | null;
          wage_currency?: string | null;
          work_hours_per_day?: number | null;
        };
        Update: {
          applied_promo_code?: string | null;
          avatar_url?: string | null;
          birthdate?: string | null;
          country?: string | null;
          display_currency?: string | null;
          hourly_wage_usd?: number | null;
          id?: string;
          name?: string | null;
          notifications_enabled?: boolean;
          premium_until?: string | null;
          referral_code?: string | null;
          referred_by?: string | null;
          wage_currency?: string | null;
          work_hours_per_day?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_profile_referred_by';
            columns: ['referred_by'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profile_applied_promo_code_fkey';
            columns: ['applied_promo_code'];
            isOneToOne: false;
            referencedRelation: 'campaign_promo_code';
            referencedColumns: ['code'];
          },
        ];
      };
      profile_hobby: {
        Row: {
          hobby_name: string;
          id: string;
          profile_id: string;
        };
        Insert: {
          hobby_name: string;
          id?: string;
          profile_id: string;
        };
        Update: {
          hobby_name?: string;
          id?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_hobby_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_suggestion: {
        Row: {
          country: string | null;
          generated_at: string;
          hobby_id: string;
          id: string;
          name: string;
          price_usd: number | null;
        };
        Insert: {
          country?: string | null;
          generated_at?: string;
          hobby_id: string;
          id?: string;
          name: string;
          price_usd?: number | null;
        };
        Update: {
          country?: string | null;
          generated_at?: string;
          hobby_id?: string;
          id?: string;
          name?: string;
          price_usd?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_suggestion_hobby_id_fkey';
            columns: ['hobby_id'];
            isOneToOne: false;
            referencedRelation: 'profile_hobby';
            referencedColumns: ['id'];
          },
        ];
      };
      tracked_item: {
        Row: {
          conversion_rate_snapshot: number | null;
          created_at: string;
          decided_at: string | null;
          freeze_until: string | null;
          id: string;
          name: string;
          note: string | null;
          price_usd: number | null;
          profile_id: string;
          status: string | null;
        };
        Insert: {
          conversion_rate_snapshot?: number | null;
          created_at?: string;
          decided_at?: string | null;
          freeze_until?: string | null;
          id?: string;
          name: string;
          note?: string | null;
          price_usd?: number | null;
          profile_id: string;
          status?: string | null;
        };
        Update: {
          conversion_rate_snapshot?: number | null;
          created_at?: string;
          decided_at?: string | null;
          freeze_until?: string | null;
          id?: string;
          name?: string;
          note?: string | null;
          price_usd?: number | null;
          profile_id?: string;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tracked_item_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
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
      item_status: 'bought' | 'skipped' | 'thinking';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      item_status: ['bought', 'skipped', 'thinking'],
    },
  },
} as const;
