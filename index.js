require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

// عند تشغيل البوت
console.log("✅ SOLAB Assistant is running...");

// رسالة /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `👋 Welcome to SOLAB!

We're happy to have you here.

🚀 Stay active
💬 Respect everyone
📢 Follow announcements
🌐 X: https://x.com/CommunitySolab

Enjoy your stay! 💜`
  );
});

// ترحيب بالأعضاء الجدد
bot.on("new_chat_members", async (msg) => {
  const chatId = msg.chat.id;

  for (const member of msg.new_chat_members) {

    // تجاهل إذا كان العضو هو البوت نفسه
    if (member.is_bot) continue;

    await bot.sendMessage(
      chatId,
`🎉 Welcome, ${member.first_name}!

Welcome to the SOLAB Community 💜

🚀 Stay active
💬 Respect everyone
📢 Read the pinned message
🌐 X: https://x.com/CommunitySolab

Enjoy your stay!`
    );
  }
});

// رسالة عند خروج عضو
bot.on("left_chat_member", (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `👋 ${msg.left_chat_member.first_name} has left the community.`
  );
});