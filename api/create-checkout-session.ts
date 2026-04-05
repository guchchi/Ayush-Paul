import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

// Valid tiers — validated server-side to prevent tampering
const VALID_TIERS: Record<number, string> = {
  99: "Supporter",
  299: "Coffee Support",
  999: "Premium Supporter",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { amount, tierName } = req.body as { amount: number; tierName: string };

  // Validate the amount against known tiers
  if (!VALID_TIERS[amount]) {
    return res.status(400).json({ error: "Invalid support tier" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set in environment variables");
    return res.status(500).json({ error: "Payment system not configured. Please try again later." });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2025-03-31.basil",
  });

  const appUrl = process.env.APP_URL || "https://ayushpaul.vercel.app";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Support Ayush Paul — ${tierName}`,
              description: "Thank you for supporting my work and projects! Every contribution helps me keep building.",
            },
            unit_amount: amount * 100, // Stripe uses paise (smallest unit)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/`,
      metadata: {
        tier: tierName,
        amount: String(amount),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Session Error:", error.message);
    return res.status(500).json({ error: error.message || "Failed to create payment session" });
  }
}
