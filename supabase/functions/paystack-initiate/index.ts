import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PAYSTACK_BASE_URL = Deno.env.get("PAYSTACK_BASE_URL") || "https://api.paystack.co";
const PAYSTACK_AUDIT_EMAIL = Deno.env.get("PAYSTACK_AUDIT_EMAIL");
const PAYSTACK_AUDIT_EMAIL_DOMAIN = Deno.env.get("PAYSTACK_AUDIT_EMAIL_DOMAIN") || "safarinjema-payments.local";

const normalizeKenyanPhone = (phone: unknown): string => {
  const digits = String(phone || "").replace(/\D/g, "");

  if (digits.startsWith("254")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0")) {
    return `+254${digits.slice(1)}`;
  }

  if (/^[17]\d{8}$/.test(digits)) {
    return `+254${digits}`;
  }

  return digits ? `+${digits}` : "";
};

const getPaystackEmail = (email: unknown, reference: string): string => {
  const providedEmail = String(email || "").trim().toLowerCase();

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(providedEmail)) {
    return providedEmail;
  }

  const domain = PAYSTACK_AUDIT_EMAIL_DOMAIN.replace(/^@/, "").toLowerCase();
  const safeReference = reference
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42) || "booking";
  const randomPart = crypto.randomUUID().slice(0, 8);
  const auditEmail = String(PAYSTACK_AUDIT_EMAIL || "").trim().toLowerCase();

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(auditEmail)) {
    const [localPart, domainPart] = auditEmail.split("@");
    return `${localPart}+paystack-${safeReference}-${randomPart}@${domainPart}`;
  }

  return `paystack-${safeReference}-${randomPart}@${domain}`;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const { email, amount, reference, callback_url, description, phone } = body;

    if (!amount) {
      return new Response(
        JSON.stringify({ error: "Amount is required" }),
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

    const baseReference = String(reference || "TRINITY").replace(/[^a-zA-Z0-9\-.=]/g, "").slice(0, 40) || "TRINITY";
    const transactionReference = `${baseReference}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const paystackEmail = getPaystackEmail(email, baseReference);

    const formattedPhone = normalizeKenyanPhone(phone);

    if (!/^\+254[17]\d{8}$/.test(formattedPhone)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Enter a valid Kenyan M-PESA phone number, for example +254722000000.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const mobileMoneyProvider = Deno.env.get("PAYSTACK_MOBILE_MONEY_PROVIDER") || "mpesa";

    const response = await fetch(`${PAYSTACK_BASE_URL}/charge`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: paystackEmail,
        amount: Math.round(Number(amount) * 100),
        currency: "KES",
        reference: transactionReference,
        callback_url: callback_url || Deno.env.get("CLIENT_URL") || undefined,
        mobile_money: {
          phone: formattedPhone,
          provider: mobileMoneyProvider,
        },
        metadata: {
          booking_reference: reference || baseReference,
          description: description || `Bus Ticket Booking - ${transactionReference}`,
          phone: formattedPhone || null,
          paystack_email: paystackEmail,
          generated_email: !email,
          payment_flow: "charge_mobile_money",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return new Response(
        JSON.stringify({
          success: false,
          error: data.message || data.data?.gateway_response || "Failed to initialize Paystack payment",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: paymentError } = await supabase.from("payments").insert({
      checkout_request_id: data.data?.reference || transactionReference,
      merchant_request_id: data.data?.reference || transactionReference,
      booking_reference: reference || baseReference,
      amount: Number(amount),
      phone: formattedPhone || email,
      status: data.data?.status === "success" ? "confirmed" : "pending",
      result_code: data.data?.status === "success" ? 0 : 1,
      result_description: data.data?.display_text || data.data?.gateway_response || "Paystack charge initiated",
      mpesa_receipt: data.data?.receipt_number || data.data?.reference || null,
    });

    if (paymentError) {
      console.error("Failed to store Paystack payment record:", paymentError);

      return new Response(
        JSON.stringify({
          success: false,
          error: "Payment initialization succeeded but the transaction could not be recorded. Please contact support.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        authorization_url: data.data?.authorization_url,
        access_code: data.data?.access_code,
        reference: data.data?.reference || transactionReference,
        status: data.data?.status || "pending",
        display_text: data.data?.display_text || data.message,
        customer_message: data.message || "Payment request sent to your phone.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Paystack initiate error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to initialize Paystack payment",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
