import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, barcode, arrival_date, supplier } = body;

  const { data, error } = await supabase
    .from("products")
    .insert([{ name, barcode, arrival_date, supplier }])
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}
