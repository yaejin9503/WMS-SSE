import { supabase } from "@/lib/supabaseClient";

export async function traceProduct(barcode: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      shipments (*)
    `
    )
    .eq("barcode", barcode)
    .single();

  if (error) throw error;
  return data;
}
