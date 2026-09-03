import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, status, payment_id } = body;

    if (status === "SUCCESS" && order_id) {
      const supabase = createClient() as any;
      await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          paid_at: new Date().toISOString(),
          payment_id: payment_id || null,
        })
        .eq("id", order_id);
    }

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("Kaspi Callback error:", error);
    return NextResponse.json({ status: "ERROR" }, { status: 500 });
  }
}
