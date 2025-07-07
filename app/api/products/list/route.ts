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
    const confirmedParam = searchParams.get("confirmed");

    if (confirmedParam !== "true" && confirmedParam !== "false") {
      return NextResponse.json(
        { error: "confirmed 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    const isConfirmed = confirmedParam === "true";

    const { data, error } = await supabase.from("products").select(`
        name,
        barcode,
        arrival_date,
        supplier,
        shipments (
          shipment_date,
          customer,
          confirmed
        )
      `);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const products = data
      .map((product) => {
        const matchedShipment = (product.shipments || []).find(
          (s) => s.confirmed === isConfirmed
        );

        return matchedShipment
          ? {
              name: product.name,
              barcode: product.barcode,
              arrivalDate: product.arrival_date,
              supplier: product.supplier,
              shipmentDate: matchedShipment.shipment_date,
              customer: matchedShipment.customer,
              confirmed: matchedShipment.confirmed,
            }
          : null;
      })
      .filter(Boolean);

    return NextResponse.json(products, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "서버 오류" },
      { status: 500 }
    );
  }
}
