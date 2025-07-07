/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { customer, items, outboundDate } = body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "필수 데이터 누락" }, { status: 400 });
    }

    // 이미 출고된 product_id 있는지 확인
    const productIds = items.map((i: any) => i.product_id);
    const { data: existingShipments, error: checkError } = await supabase
      .from("shipments")
      .select(
        `
          product_id,
          products(barcode)
        `
      )
      .in("product_id", productIds);

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existingShipments && existingShipments.length > 0) {
      const barcodes = existingShipments
        .map((s) => (s as any).products?.barcode)
        .filter((b): b is string => !!b) // 타입 가드
        .join(", ");

      return NextResponse.json(
        {
          error: `이미 출고된 제품이 포함되어 있습니다: ${barcodes}`,
        },
        { status: 400 }
      );
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
