import { supabase } from "@/lib/supabaseClient";

export async function confirmShipment(shipmentId: string) {
  const { data, error } = await supabase
    .from("shipments")
    .update({ confirmed: true })
    .eq("id", shipmentId)
    .single();

  if (error) throw error;
  return data;
}
