import { Tables } from '@/integrations/supabase/types';

export type SupabaseProduct = Tables<'products'>;
export type SupabaseCustomer = Tables<'customers'>;
export type SupabaseTransaction = Tables<'transactions'>;
export type SupabaseReview = Tables<'reviews'>;
export type SupabaseVirtualCart = Tables<'virtual_carts'>;
export type SupabaseAnalytics = Tables<'analytics'>;
export type SupabaseProfile = Tables<'profiles'>;