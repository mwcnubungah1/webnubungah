import { createClient } from '@supabase/supabase-js';

// Load environment variables safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials exist
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co'
);

/**
 * Supabase client instance.
 * Lazily validated to prevent crashing on launch if environment keys are missing.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper function to assert that Supabase is configured before calling DB methods.
 */
export function getSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured yet. Silakan isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di berkas .env Anda.'
    );
  }
  return supabase;
}

// Helper to convert snake_case object keys to camelCase keys
export function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => snakeToCamel(v));
  } else if (obj !== null && obj !== undefined && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = snakeToCamel(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

// Helper to convert camelCase object keys to snake_case keys
export function camelToSnake(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => camelToSnake(v));
  } else if (obj !== null && obj !== undefined && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = camelToSnake(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

export function getTableName(model: string): string {
  if (model === 'keuangan') return 'kas_dana';
  return model;
}

/**
 * Generic Fetch all records from Supabase and map them to CamelCase
 */
export async function fetchTableData(model: string): Promise<any[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const table = getTableName(model);
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error(`Error fetching table ${table}:`, error);
    throw error;
  }

  // Convert numeric/UUID ids to strings for React consistency
  const camelData = snakeToCamel(data || []);
  return camelData.map((item: any) => ({
    ...item,
    id: String(item.id)
  }));
}

/**
 * Generic Insert into Supabase with automatic ID stripping and mapping
 */
export async function insertTableData(model: string, item: any): Promise<any> {
  if (!isSupabaseConfigured || !supabase) {
    return item;
  }
  const table = getTableName(model);
  const dbItem = camelToSnake(item);

  // All our tables use TEXT PRIMARY KEY, so we must keep the string ID intact.
  if (dbItem.id === undefined || dbItem.id === null) {
    dbItem.id = `${table.slice(0, 2)}-${Date.now()}`;
  } else {
    dbItem.id = String(dbItem.id);
  }

  const { data, error } = await supabase
    .from(table)
    .insert([dbItem])
    .select('*')
    .single();

  if (error) {
    console.error(`Error inserting into ${table}:`, error);
    throw error;
  }

  const result = snakeToCamel(data);
  return {
    ...result,
    id: String(result.id)
  };
}

/**
 * Generic Update inside Supabase
 */
export async function updateTableData(model: string, id: string, item: any): Promise<any> {
  if (!isSupabaseConfigured || !supabase) {
    return item;
  }
  const table = getTableName(model);
  const dbItem = camelToSnake(item);

  // Keep ID intact if it's an integer
  const dbId = isNaN(Number(id)) ? id : Number(id);
  delete dbItem.id; // Don't try to update primary key

  const { data, error } = await supabase
    .from(table)
    .update(dbItem)
    .eq('id', dbId)
    .select('*')
    .single();

  if (error) {
    console.error(`Error updating table ${table}:`, error);
    throw error;
  }

  const result = snakeToCamel(data);
  return {
    ...result,
    id: String(result.id)
  };
}

/**
 * Generic Delete from Supabase
 */
export async function deleteTableData(model: string, id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return true;
  }
  const table = getTableName(model);
  const dbId = isNaN(Number(id)) ? id : Number(id);

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', dbId);

  if (error) {
    console.error(`Error deleting from table ${table}:`, error);
    throw error;
  }
  return true;
}
