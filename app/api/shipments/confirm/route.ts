/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "업데이트할 데이터가 없습니다." },
        { status: 400 }
      );
    }

    for (const item of items) {
      const { barcode, confirmed } = item;

      if (!barcode || confirmed === undefined) {
        return NextResponse.json(
          { error: "각 아이템에 barcode와 confirmed가 필요합니다." },
          { status: 400 }
        );
      }

      // product_id 조회
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id")
        .eq("barcode", barcode)
        .single();

      if (productError || !product) {
        return NextResponse.json(
          { error: `제품(${barcode})을 찾을 수 없습니다.` },
          { status: 404 }
        );
      }

      // shipments update
      const { error: updateError } = await supabase
        .from("shipments")
        .update({ confirmed })
        .eq("product_id", product.id);

      if (updateError) {
        return NextResponse.json(
          { error: `제품(${barcode}) 업데이트 실패: ${updateError.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("서버 오류:", err.message);
    return NextResponse.json(
      { error: err.message || "서버 오류" },
      { status: 500 }
    );
  }
}
