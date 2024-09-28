const express = require("express");
const cors = require("cors");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const app = express();
app.use(cors());
app.use(express.json());

let userSecrets = {}; // // User secrets kept in temporary storage

// Create a QR code and a 2FA secret.

app.post("/generate-2fa", (req, res) => {
  const { userId } = req.body;

  const secret = speakeasy.generateSecret({ length: 20 });
  userSecrets[userId] = secret.base32;

  qrcode.toDataURL(secret.otpauth_url, (err, qrCode) => {
    if (err) {
      return res.status(500).json({ message: "Error generating QR code" });
    }
    res.json({ qrCode, secret: secret.base32 });
  });
});

// Verify OTP
app.post("/verify-2fa", (req, res) => {
  const { userId, token } = req.body;
  const secret = userSecrets[userId];

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
  });

  if (verified) {
    return res.json({ success: true, message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
