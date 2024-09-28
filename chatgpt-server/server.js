const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config(); // loading environment variables

const app = express();

app.use(cors());
s;
app.use(express.json());

//Launch the OpenAI API.
const openai = new OpenAI({
  // Loading the OpenAI API key from .env
  apiKey: process.env.OPENAI_API_KEY,
});

// ChatGPT's route
app.post("/chatgpt", async (req, res) => {
  const { userMessage } = req.body; // From the request body, extract the user's message.

  try {
    // To retrieve a response from the ChatGPT model, use the OpenAI API.
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    // Take the response from the OpenAI API and return it.
    const message = chatResponse.choices[0].message.content;
    res.json({ message });
  } catch (error) {
    console.error("Error with ChatGPT:", error.message);
    res.status(500).json({ message: "Error with ChatGPT: " + error.message });
  }
});

// Start the 2nd server on a new port 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`ChatGPT server is running on port ${PORT}`);
});
