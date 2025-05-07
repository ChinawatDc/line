const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = req.body;

  if (data.events && data.events[0].source.type === "group") {
    const groupId = data.events[0].source.groupId;
    const replyToken = data.events[0].replyToken;

    await replyMessage(replyToken, `This is your Group ID: ${groupId}`);
  }

  res.json({ status: "success" });
};

async function replyMessage(replyToken, message) {
  const url = "https://api.line.me/v2/bot/message/reply";
  const payload = {
    replyToken,
    messages: [{ type: "text", text: message }],
  };

  try {
    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.LINE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(
      "Error sending message to LINE:",
      error.response?.data || error.message
    );
  }
}
