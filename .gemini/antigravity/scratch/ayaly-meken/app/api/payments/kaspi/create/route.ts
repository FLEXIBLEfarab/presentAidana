import { NextResponse, type NextRequest } from "next/server";

// Kaspi Pay credentials (to be filled from Kaspi Business cabinet)
const KASPI_MERCHANT_ID = process.env.KASPI_MERCHANT_ID || "";
const KASPI_SECRET = process.env.KASPI_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, amount, apartmentName, guestPhone } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Demo / Sandbox fallback if credentials are not yet entered
    if (!KASPI_MERCHANT_ID) {
      const mockPaymentId = "KASPI_DEMO_" + Date.now();
      const mockQrUrl = `https://kaspi.kz/pay/demo?orderId=${mockPaymentId}&amount=${amount}`;
      return NextResponse.json({
        success: true,
        isDemo: true,
        paymentId: mockPaymentId,
        payUrl: mockQrUrl,
        qrCodeUrl: mockQrUrl,
        amount,
        message: "Kaspi Pay demo mode (add KASPI_MERCHANT_ID to .env.local to go live)",
      });
    }

    // Production Kaspi Pay API call
    const kaspiRes = await fetch("https://kaspi.kz/api/payments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Merchant-Id": KASPI_MERCHANT_ID,
        "Authorization": `Bearer ${KASPI_SECRET}`,
      },
      body: JSON.stringify({
        order_id: bookingId,
        amount,
        description: `Бронь: ${apartmentName || "Апартаменты"}`,
        customer_phone: guestPhone,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://ayaly-meken.kz"}/book/success?bookingId=${bookingId}`,
      }),
    });

    const data = await kaspiRes.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    console.error("Kaspi create payment error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
