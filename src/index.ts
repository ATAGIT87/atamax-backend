import express from "express";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors())


const PORT = process.env.PORT || 8080;

// Validate env variables
if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL) {
  console.error("❌ Missing SENDGRID_API_KEY or FROM_EMAIL in .env file");
  process.exit(1);
}

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Parse JSON body
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static("public"));

// Main route for sending email
app.post("/send-email", async (req, res) => {
  try {
    const { name, email, amount, message } = req.body;

    // Validation
    if (!name || !email || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const mail = {
      to: 'ali.tabatabaei987@gmail.com',
      from: process.env.FROM_EMAIL as string,
      subject: `Your Apple Gift Card - €${amount}`,
      text: `Dear ${name},\n\nThank you for choosing our service!\nYou selected an Apple Gift Card worth €${amount}.\n\nMessage: ${message || "-"}\n\nBest regards,\nApple Gift Team`,
      html: `
        <h2>Hi ${name},</h2>
        <h2>Hi ${email},</h2>
        <p>🎁 has choosed our service!</p>
        <p><b>Gift Card:</b> Apple Gift Card</p>
        <p><b>Amount:</b> €${amount}</p>
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
