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
    const barcode = searchParams.get("barcoyde");

    if (!barcode) {
      return NextResponse.json(
        { error: "바코드가 필요합니다." },
        { status: 400 }
      );
    }

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

    console.log("조회된 데이터:", data);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "서버 오류" },
      { status: 500 }
    );
  }
}
