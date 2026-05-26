import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { amount, userId } = req.body;

  if (!amount) {
    return res.status(400).json({ error: "Missing donation amount" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set");
    return res.status(500).json({ error: "Payment system not configured" });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2024-06-20",
  });

  const appUrl = process.env.APP_URL || "http://localhost:5173";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "upi"],
      line_items: [
        {
          price_data: {
            currency: "usd", // Donations are typically USD
            product_data: {
              name: "Donation: Support Open Innovation",
              description: "Thank you for supporting Ayush Paul's engineering research.",
              images: ["https://ayushpaul.in/founder.png"],
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/vault?donation=success`,
      cancel_url: `${appUrl}/thank-you`,
      metadata: {
        type: "donation",
        userId: userId || "anonymous",
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Donation Error:", error.message);
    return res.status(500).json({ error: "Failed to create donation session" });
  }
}
