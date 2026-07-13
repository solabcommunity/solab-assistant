require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

console.log("✅ SOLAB Assistant is running...");

// =============================
// /start
// =============================
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`👋 Welcome to SOLAB! 💜

Great to have you here.

This is the official community where we build, learn, and grow together.

🚀 Join the conversation
💬 Ask questions
📌 Check the pinned message
🌐 X: https://x.com/CommunitySolab

Welcome to the SOLAB family!`
  );
});

// =============================
// Welcome New Members
// =============================
bot.on("new_chat_members", async (msg) => {
  const chatId = msg.chat.id;

  for (const member of msg.new_chat_members) {

    // Ignore bots
    if (member.is_bot) continue;

    await bot.sendMessage(
      chatId,
`👋 Welcome to SOLAB, ${member.first_name}! 💜

It's great to have you with us.

Take a look around, join the conversation, and don't hesitate to jump in.

📌 Please check the pinned message to get started.

Let's build something amazing together. 🚀`
    );
  }
});

// =============================
// Goodbye Message
// =============================
bot.on("left_chat_member", (msg) => {
  bot.sendMessage(
    msg.chat.id,
`👋 Thanks for being part of SOLAB, ${msg.left_chat_member.first_name}.

Wishing you all the best, and you're always welcome back. 💜`
  );
});