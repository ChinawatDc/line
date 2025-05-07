const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const LINE_API_URL = "https://api.line.me/v2/bot/message/reply";

// Entry point for LINE webhook
app.post("/reply", async (req, res) => {
  const events = req.body.events;

  if (!events || !Array.isArray(events)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  for (const event of events) {
    const { replyToken, source } = event;

    if (!replyToken || !source || !source.type) continue;

    let message = "";

    switch (source.type) {
      case "group":
        message = `👥 This is your Group ID:\n${source.groupId}`;
        break;
      case "room":
        message = `💬 This is your Room ID:\n${source.roomId}`;
        break;
      case "user":
        message = `🙋‍♂️ This is your User ID:\n${source.userId}`;
        break;
      default:
        message = "⚠️ Unknown source type.";
        break;
    }

    console.log(`[${source.type.toUpperCase()}] Incoming event`, source);

    await replyMessage(replyToken, message);
  }

  res.json({ status: "success" });
});

// Send reply message to LINE
async function replyMessage(replyToken, message) {
  const payload = {
    replyToken,
    messages: [{ type: "text", text: message }],
  };

  try {
    await axios.post(LINE_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${process.env.LINE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Replied message to LINE");
  } catch (error) {
    console.error(
      "❌ Error sending message to LINE:",
      error.response?.data || error.message
    );
  }
}

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 LINE bot server running at http://localhost:${PORT}`);
});
