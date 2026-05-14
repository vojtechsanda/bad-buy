export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      account: {
        Row: {
          birthdate: string | null;
          country: string | null;
          created_at: string;
          decision_count: number;
          display_currency: string | null;
          hourly_wage_usd: number | null;
          id: string;
          name: string | null;
          notifications_enabled: boolean;
          premium_expires_at: string | null;
          referral_code: string | null;
          wage_currency: string | null;
          work_hours_per_day: number;
        };
        Insert: {
          birthdate?: string | null;
          country?: string | null;
          created_at?: string;
          decision_count?: number;
          display_currency?: string | null;
          hourly_wage_usd?: number | null;
          id: string;
          name?: string | null;
          notifications_enabled?: boolean;
          premium_expires_at?: string | null;
          referral_code?: string | null;
          wage_currency?: string | null;
          work_hours_per_day?: number;
        };
        Update: {
          birthdate?: string | null;
          country?: string | null;
          created_at?: string;
          decision_count?: number;
          display_currency?: string | null;
          hourly_wage_usd?: number | null;
          id?: string;
          name?: string | null;
          notifications_enabled?: boolean;
          premium_expires_at?: string | null;
          referral_code?: string | null;
          wage_currency?: string | null;
          work_hours_per_day?: number;
        };
        Relationships: [];
      };
      account_hobby: {
        Row: {
          account_id: string;
          created_at: string;
          hobby_name: string;
          id: string;
          is_moderated: boolean;
          predefined_hobby_id: string | null;
        };
        Insert: {
          account_id: string;
          created_at?: string;
          hobby_name: string;
          id?: string;
          is_moderated?: boolean;
          predefined_hobby_id?: string | null;
        };
        Update: {
          account_id?: string;
          created_at?: string;
          hobby_name?: string;
          id?: string;
          is_moderated?: boolean;
          predefined_hobby_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'account_hobby_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'account';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'account_hobby_predefined_hobby_id_fkey';
            columns: ['predefined_hobby_id'];
            isOneToOne: false;
            referencedRelation: 'predefined_hobby';
            referencedColumns: ['id'];
          },
        ];
      };
      account_suggestion: {
        Row: {
          country: string;
          generated_at: string;
          hobby_id: string;
          id: string;
          item_emoji: string | null;
          name: string;
          price_usd: number;
        };
        Insert: {
          country: string;
          generated_at?: string;
          hobby_id: string;
          id?: string;
          item_emoji?: string | null;
          name: string;
          price_usd: number;
        };
        Update: {
          country?: string;
          generated_at?: string;
          hobby_id?: string;
          id?: string;
          item_emoji?: string | null;
          name?: string;
          price_usd?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'account_suggestion_hobby_id_fkey';
            columns: ['hobby_id'];
            isOneToOne: false;
            referencedRelation: 'account_hobby';
            referencedColumns: ['id'];
          },
        ];
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
          base?: string;
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
      notification: {
        Row: {
          account_id: string;
          created_at: string;
          id: string;
          read_at: string | null;
          tracked_item_id: string;
          type: Database['public']['Enums']['notification_type'];
        };
        Insert: {
          account_id: string;
          created_at?: string;
          id?: string;
          read_at?: string | null;
          tracked_item_id: string;
          type: Database['public']['Enums']['notification_type'];
        };
        Update: {
          account_id?: string;
          created_at?: string;
          id?: string;
          read_at?: string | null;
          tracked_item_id?: string;
          type?: Database['public']['Enums']['notification_type'];
        };
        Relationships: [
          {
            foreignKeyName: 'notification_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'account';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notification_tracked_item_id_fkey';
            columns: ['tracked_item_id'];
            isOneToOne: false;
            referencedRelation: 'tracked_item';
            referencedColumns: ['id'];
          },
        ];
      };
      predefined_hobby: {
        Row: {
          category: string;
          id: string;
          lucide_icon: string;
          name: string;
          sort_order: number;
        };
        Insert: {
          category: string;
          id?: string;
          lucide_icon: string;
          name: string;
          sort_order?: number;
        };
        Update: {
          category?: string;
          id?: string;
          lucide_icon?: string;
          name?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      promo_code: {
        Row: {
          code: string;
          created_at: string;
          current_uses: number;
          expires_at: string | null;
          id: string;
          is_active: boolean;
          max_uses: number | null;
          premium_months_granted: number;
        };
        Insert: {
          code: string;
          created_at?: string;
          current_uses?: number;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean;
          max_uses?: number | null;
          premium_months_granted?: number;
        };
        Update: {
          code?: string;
          created_at?: string;
          current_uses?: number;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean;
          max_uses?: number | null;
          premium_months_granted?: number;
        };
        Relationships: [];
      };
      referral_redemption: {
        Row: {
          id: string;
          premium_months_granted: number;
          promo_code_id: string | null;
          redeemed_at: string;
          redeemer_account_id: string;
          referrer_account_id: string | null;
        };
        Insert: {
          id?: string;
          premium_months_granted?: number;
          promo_code_id?: string | null;
          redeemed_at?: string;
          redeemer_account_id: string;
          referrer_account_id?: string | null;
        };
        Update: {
          id?: string;
          premium_months_granted?: number;
          promo_code_id?: string | null;
          redeemed_at?: string;
          redeemer_account_id?: string;
          referrer_account_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'referral_redemption_promo_code_id_fkey';
            columns: ['promo_code_id'];
            isOneToOne: false;
            referencedRelation: 'promo_code';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'referral_redemption_redeemer_account_id_fkey';
            columns: ['redeemer_account_id'];
            isOneToOne: true;
            referencedRelation: 'account';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'referral_redemption_referrer_account_id_fkey';
            columns: ['referrer_account_id'];
            isOneToOne: false;
            referencedRelation: 'account';
            referencedColumns: ['id'];
          },
        ];
      };
      tracked_item: {
        Row: {
          account_id: string;
          conversion_rate_snapshot: number;
          created_at: string;
          decided_at: string | null;
          freeze_until: string | null;
          frozen_at: string | null;
          id: string;
          item_emoji: string | null;
          name: string | null;
          price_currency: string;
          price_usd: number;
          status: Database['public']['Enums']['tracked_item_status'];
        };
        Insert: {
          account_id: string;
          conversion_rate_snapshot: number;
          created_at?: string;
          decided_at?: string | null;
          freeze_until?: string | null;
          frozen_at?: string | null;
          id?: string;
          item_emoji?: string | null;
          name?: string | null;
          price_currency: string;
          price_usd: number;
          status?: Database['public']['Enums']['tracked_item_status'];
        };
        Update: {
          account_id?: string;
          conversion_rate_snapshot?: number;
          created_at?: string;
          decided_at?: string | null;
          freeze_until?: string | null;
          frozen_at?: string | null;
          id?: string;
          item_emoji?: string | null;
          name?: string | null;
          price_currency?: string;
          price_usd?: number;
          status?: Database['public']['Enums']['tracked_item_status'];
        };
        Relationships: [
          {
            foreignKeyName: 'tracked_item_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'account';
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
      notification_type: 'freeze_thawed';
      tracked_item_status: 'frozen' | 'bought' | 'skipped';
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
      notification_type: ['freeze_thawed'],
      tracked_item_status: ['frozen', 'bought', 'skipped'],
    },
  },
} as const;
