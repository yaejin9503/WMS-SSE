/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { barcode, confirmed } = body;

    if (!barcode || confirmed === undefined) {
      return NextResponse.json(
        { error: "barcode와 confirmed가 필요합니다." },
        { status: 400 }
      );
    }
    // confirm API: product_id 조회 포함
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("barcode", barcode)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "제품을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // update shipments
    const { error: updateError } = await supabase
      .from("shipments")
      .update({ confirmed })
      .eq("product_id", product.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "서버 오류" },
      { status: 500 }
    );
  }
}
