/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const barcode = searchParams.get("barcode");

    if (!barcode) {
      return NextResponse.json(
        { error: "바코드가 필요합니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .select("id, name, barcode, arrival_date, supplier")
      .eq("barcode", barcode)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    const productId = data.id;
    const { data: existingShipments, error: checkError } = await supabase
      .from("shipments")
      .select(
        `
          product_id,
          products(barcode)
        `
      )
      .eq("product_id", productId);

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
          error: `이미 출고 등록된 제품입니다. 바코드: ${barcodes}`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "서버 오류" },
      { status: 500 }
    );
  }
}
