import { supabase } from "@/lib/supabaseClient";

export async function registerProduct(product: {
  name: string;
  barcode: string;
  manufacture_date: string;
  arrival_date: string;
  supplier: string;
}) {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .single();

  if (error) throw error;
  return data;
}
