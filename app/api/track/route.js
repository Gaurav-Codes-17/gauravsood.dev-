import { NextResponse } from "next/server";

const visitMap = new Map();
const COOLDOWN_MS = 5 * 60 * 1000; 

export async function POST(req) {
  try {
  const rawIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim();
const ip = (!rawIp || rawIp === "::1" || rawIp === "127.0.0.1") ? "8.8.8.8" : rawIp;

    // Rate limit check
    const lastVisit = visitMap.get(ip);
    if (lastVisit && Date.now() - lastVisit < COOLDOWN_MS) {
      console.log("⏳ Rate limited:", ip);
      return NextResponse.json({ success: false, reason: "rate_limited" });
    }
    visitMap.set(ip, Date.now());

    // switched to ip-api.com — works better server-side
    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const geo = await geoRes.json();

    const visitData = {
      ip,
      city: geo.city,
      country: geo.country, // ip-api uses .country not .country_name
      time: new Date().toLocaleString(),
      page: req.headers.get("referer") || "direct",
    };

    // Send email
    await fetch(`${process.env.BASE_URL}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitData),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}