import express from "express";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ تبدیل رشته PORT به عدد
const PORT = Number(process.env.PORT) || 8080;

if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL) {
  console.warn("⚠️ Warning: Missing SENDGRID_API_KEY or FROM_EMAIL");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// ✅ مسیر ارسال ایمیل
app.post("/send-email", async (req, res) => {
  try {
    const { name, email, amount, message } = req.body;
    if (!name || !email || !amount)
      return res.status(400).json({ error: "Missing required fields" });

    const mail = {
      to: "ali.tabatabaei987@gmail.com",
      from: process.env.FROM_EMAIL as string,
      subject: `Your Apple Gift Card - €${amount}`,
      html: `
        <h2>Hi ${name},</h2>
        <p>🎁 You selected an Apple Gift Card worth €${amount}</p>
        ${message ? `<p><b>Your message:</b> ${message}</p>` : ""}
        <p>Best regards,<br>Apple Gift Team</p>
      `,
    };

    await sgMail.send(mail);
    console.log(`✅ Email sent to ${email}`);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (err: any) {
    console.error("❌ SendGrid error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ✅ باید حتماً روی 0.0.0.0 گوش بده تا Cloud Run بتونه دسترسی پیدا کنه
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
