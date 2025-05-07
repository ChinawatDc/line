const axios = require("axios");

module.exports = async (req, res) => {
  // ตรวจสอบว่าเป็น POST Request
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = req.body;

  // ตรวจสอบว่า 'events' มีค่าและเป็นประเภทที่ถูกต้อง
  if (data.events && data.events[0] && data.events[0].source.type === "group") {
    const groupId = data.events[0].source.groupId;
    const replyToken = data.events[0].replyToken;

    try {
      await replyMessage(replyToken, `This is your Group ID: ${groupId}`);
      res.status(200).json({ status: "success" }); // ส่ง status 200 เมื่อทุกอย่างสำเร็จ
    } catch (error) {
      console.error("Error while replying to LINE:", error);
      res.status(500).json({ error: "Internal Server Error" }); // ส่ง status 500 ถ้ามีข้อผิดพลาด
    }
  } else {
    res.status(400).json({ error: "Invalid data structure" }); // ส่ง status 400 ถ้าข้อมูลไม่ถูกต้อง
  }
};

// ฟังก์ชันสำหรับการตอบกลับข้อความ
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
    throw error; // สั่งให้ไปจับในส่วนที่เรียกฟังก์ชันนี้
  }
}
