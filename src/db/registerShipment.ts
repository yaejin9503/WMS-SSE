import { supabase } from "@/lib/supabaseClient";

export async function registerShipment(shipment: {
  product_id: string;
  quantity: number;
  customer: string;
}) {
  const { data, error } = await supabase
    .from("shipments")
    .insert([shipment])
    .single();

  if (error) throw error;
  return data;
}
