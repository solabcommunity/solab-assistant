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
// User Warnings
// =============================
const userWarnings = {};

// =============================
// /start
// =============================
// =============================
// /help
// =============================
bot.onText(/\/help/, (msg) => {

  bot.sendMessage(
    msg.chat.id,
`🤖 SOLAB Assistant

Available Commands:

/start - Welcome message
/help - Show commands
/rules - Community rules
/socials - Official links
/website - Website status`
  );

});

// =============================
// /rules
// =============================
bot.onText(/\/rules/, (msg) => {

  bot.sendMessage(
    msg.chat.id,
`📜 SOLAB Community Rules

1. Respect everyone.
2. No spam.
3. No advertising.
4. No scam links.
5. Stay on topic.

Let's build a great community together 💜`
  );

});

// =============================
// /socials
// =============================
bot.onText(/\/socials/, (msg) => {

  bot.sendMessage(
    msg.chat.id,
`🌐 Official SOLAB Links

𝕏 X
https://x.com/CommunitySolab

Telegram
https://t.me/JoinSOLAB`
  );

});

// =============================
// /website
// =============================
bot.onText(/\/website/, (msg) => {

  bot.sendMessage(
    msg.chat.id,
`🌐 Website

Coming Soon...

Stay tuned 💜`
  );

});

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
// Anti Spam
// =============================
bot.on("message", async (msg) => {

  if (!msg.from) return;

  if (msg.text && msg.text.startsWith("/")) return;

  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Trusted users
  if (TRUSTED_USERS.includes(userId)) return;

  // Ignore admins
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
    return;
  }

  const text = msg.text || "";

  const hasLink =
    /(https?:\/\/|www\.|t\.me|telegram\.me|x\.com|twitter\.com|discord\.gg|discord\.com)/i.test(text);

  const hasMention =
    /@\w+/i.test(text);

  const isForward =
    msg.forward_date ||
    msg.forward_from ||
    msg.forward_sender_name;

  if (!(hasLink || hasMention || isForward)) return;

  try {

    // Delete message
    await bot.deleteMessage(chatId, msg.message_id);

    // Count warnings
    if (!userWarnings[userId]) {
      userWarnings[userId] = 0;
    }

    userWarnings[userId]++;

    if (userWarnings[userId] >= 3) {

      await bot.restrictChatMember(chatId, userId, {
        permissions: {
          can_send_messages: false,
        },
        until_date: Math.floor(Date.now() / 1000) + 86400,
      });

      const muted = await bot.sendMessage(
        chatId,
        `🚫 ${msg.from.first_name} has been muted for 24 hours.\nReason: Spam`
      );

      setTimeout(() => {
        bot.deleteMessage(chatId, muted.message_id).catch(() => {});
      }, 5000);

      return;

    }

    const warning = await bot.sendMessage(
      chatId,
      `⚠️ ${msg.from.first_name}\n\nLinks, mentions and forwarded messages are not allowed.\n\nWarning ${userWarnings[userId]}/3`
    );

    setTimeout(() => {
      bot.deleteMessage(chatId, warning.message_id).catch(() => {});
    }, 5000);

  } catch (err) {
    console.log(err);
  }

});