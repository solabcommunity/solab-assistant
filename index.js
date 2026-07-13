require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

console.log("✅ SOLAB Assistant is running...");

// =============================
// Trusted Users
// =============================
const TRUSTED_USERS = [
  937663893,   // Saeed
  6726885511,  // Black
];

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

// =============================
// Anti-Spam (Links Filter)
// =============================
bot.on("message", async (msg) => {

  if (!msg.text) return;

  // Ignore bot commands
  if (msg.text.startsWith("/")) return;

  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Allow trusted users
  if (TRUSTED_USERS.includes(userId)) return;

  // Allow admins
  try {
    const member = await bot.getChatMember(chatId, userId);

    if (
      member.status === "administrator" ||
      member.status === "creator"
    ) {
      return;
    }
  } catch (err) {
    console.log(err);
  }

  // Detect links
  const hasLink =
    /(https?:\/\/|www\.|t\.me|telegram\.me|x\.com|twitter\.com|discord\.gg|discord\.com)/i.test(
      msg.text
    );

  if (!hasLink) return;

  try {

    // Delete link message
    await bot.deleteMessage(chatId, msg.message_id);

    // Warning
    const warning = await bot.sendMessage(
      chatId,
      `⚠️ ${msg.from.first_name}, links are not allowed.`
    );

    // Delete warning after 5 seconds
    setTimeout(() => {
      bot.deleteMessage(chatId, warning.message_id).catch(() => {});
    }, 5000);

  } catch (err) {
    console.log(err);
  }

});