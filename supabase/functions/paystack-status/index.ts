import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PAYSTACK_BASE_URL = Deno.env.get("PAYSTACK_BASE_URL") || "https://api.paystack.co";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const url = new URL(req.url);
    const reference = url.searchParams.get("reference");

    if (!reference) {
      return new Response(
        JSON.stringify({ error: "reference is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Paystack is not configured. Please contact support.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const response = await fetch(`${PAYSTACK_BASE_URL}/charge/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return new Response(
        JSON.stringify({
          success: false,
          error: data.message || "Failed to verify Paystack payment",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const charge = data.data;
    const status = charge.status === "success"
      ? "success"
      : charge.status === "failed" || charge.status === "timeout"
      ? "failed"
      : "pending";

    const paymentRow = {
      checkout_request_id: reference,
      merchant_request_id: charge.reference,
      booking_reference: charge.metadata?.booking_reference || null,
      amount: typeof charge.amount === "number" ? charge.amount / 100 : Number(charge.amount || 0) / 100,
      phone: charge.metadata?.phone || charge.customer?.phone || charge.customer?.email || "unknown",
      status: status === "success" ? "confirmed" : status === "failed" ? "failed" : "pending",
      result_code: status === "success" ? 0 : status === "failed" ? 1 : null,
      result_description: charge.gateway_response || charge.display_text || charge.message || "Paystack payment status updated",
      mpesa_receipt: charge.receipt_number || charge.reference,
      updated_at: new Date().toISOString(),
    };

    const { error: syncError } = await supabase
      .from("payments")
      .upsert(paymentRow, { onConflict: "checkout_request_id" });

    if (syncError) {
      console.error("Failed to sync Paystack payment record:", syncError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        status,
        reference: charge.reference,
        amount: typeof charge.amount === "number" ? charge.amount / 100 : null,
        currency: charge.currency,
        gateway_response: charge.gateway_response || charge.display_text || charge.message || data.message,
        receipt_number: charge.receipt_number,
        message: data.message,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Paystack status error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify Paystack payment",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
