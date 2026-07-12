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
bot.on("new_chat_members", (msg) => {
  const chatId = msg.chat.id;

  msg.new_chat_members.forEach((member) => {
    bot.sendMessage(
      chatId,
      `🎉 Welcome, ${member.first_name}!

Welcome to the SOLAB Community. 💜

📢 Please read the pinned message.
🚀 Stay active and enjoy the community!`
    );
  });
});

// رسالة عند خروج عضو
bot.on("left_chat_member", (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `👋 ${msg.left_chat_member.first_name} has left the community.`
  );
});