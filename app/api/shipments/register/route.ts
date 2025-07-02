/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, outboundDate } = body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "필수 데이터 누락" }, { status: 400 });
    }

    const insertData = items.map((item: any) => ({
      product_id: item.product_id,
      quantity: item.quantity || 1,
      customer,
      shipment_date: outboundDate,
    }));

    const { data, error } = await supabase.from("shipments").insert(insertData);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("API error:", err.message);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
