// index.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to handle form submission
app.post("/submit", async (req, res) => {
  const { email, modDetails } = req.body;

  if (!email || !modDetails) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "hotmail", // for Outlook. Use 'gmail' if using Gmail.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.TO_EMAIL,
      subject: "New Mod Submission",
      text: `Email: ${email}\n\nMod Details:\n${modDetails}`,
    };

    await transporter.sendMail(mailOptions);
    res.redirect("/thankyou.html"); // if you're hosting the HTML on the same server
    // Or res.json({ message: "Form submitted successfully!" });
  } catch (err) {
    console.error("Email failed:", err);
    res.status(500).json({ error: "Email sending failed." });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
