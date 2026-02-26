import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ALERT_EMAIL,
      pass: process.env.ALERT_EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Portfolio Alert" <${process.env.ALERT_EMAIL}>`,
    to: process.env.ALERT_EMAIL,
    subject: "👀 Someone visited your portfolio",
    html: `
      <h3>New Visitor Alert</h3>
      <p><b>Country:</b> ${data.country}</p>
      <p><b>City:</b> ${data.city}</p>
      <p><b>Time:</b> ${data.time}</p>
      <p><b>Page:</b> ${data.page}</p>
    `
  });

  return NextResponse.json({ success: true });
}