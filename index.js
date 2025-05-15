const mineflayer = require('mineflayer');
const fetch = require('node-fetch');

const GEMINI_API_KEY = 'YOUR_API_KEY'; // Replace this with your actual Gemini API key
const BOT_NAME = 'BeastyBot'; // Your bot's username

function createBot() {
  const bot = mineflayer.createBot({
    host: 'ip.aternos.host',
    username: BOT_NAME,
    port: 25565,
    version: '1.16.5',
  });

  bot.on('spawn', () => {
    bot.chat('/register aagop04');
  });

  bot.on('chat', async (username, message) => {
    if (username === bot.username) return;

    if (message.startsWith(`/msg ${BOT_NAME}`)) {
      const userMessage = message.split(`${BOT_NAME}`)[1]?.trim();

      if (!userMessage) return;

      bot.chat(`/msg ${username} Thinking...`);

      try {
        const aiResponse = await askGemini(userMessage);
        if (aiResponse) {
          bot.chat(`/msg ${username} ${aiResponse}`);
        } else {
          bot.chat(`/msg ${username} Sorry, I couldn't understand that.`);
        }
      } catch (err) {
        bot.chat(`/msg ${username} Error: ${err.message}`);
      }
    }
  });

  bot.on("move", () => {
    bot.setControlState("jump", true);
    setTimeout(() => {
      bot.setControlState("jump", false);
    }, 1000);
    setTimeout(() => {}, 1000);
  });
}

async function askGemini(prompt) {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a Minecraft expert and only give help related to Minecraft. Respond to: "${prompt}"`
          }]
        }]
      })
    }
  );

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

createBot();
