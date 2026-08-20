/**
 * 🤖 Telegram Bot — романтический сценарий (Node.js версия)
 * Работает в связке с Express-сервером.
 * На Railway — webhook, локально — polling.
 */

const TelegramBot = require('node-telegram-bot-api');

// ─── НАСТРОЙКИ (замени под себя) ──────────────────────────────────
const CORRECT_1 = 'WhatsApp';           // Ответ на вопрос 1
const CORRECT_2 = 'Во дворе';           // Ответ на вопрос 2
const OPTIONS_1 = ['Instagram', 'Telegram', 'WhatsApp', 'TikTok'];
const OPTIONS_2 = ['В школе', 'Во дворе', 'В интернете', 'На вечеринке'];

// Состояния пользователей
const userStep = new Map();

// Клавиатура из массива строк
function kb(options) {
  return {
    reply_markup: {
      keyboard: options.map(o => [{ text: o }]),
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

const removeKb = { reply_markup: { remove_keyboard: true } };
const continueKb = kb(['Дальше ➡️']);

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function sendTyping(bot, chatId, ms) {
  await bot.sendChatAction(chatId, 'typing');
  await sleep(ms);
}

// ─── Эмоциональная последовательность ─────────────────────────────
async function emotionalSequence(bot, chatId) {
  const msgs = [
    [2500, 'Знаешь, я иногда вспоминаю тот момент…'],
    [3000, 'И каждый раз думаю — как мне повезло 🍀'],
    [2500, 'С тех пор столько всего было…'],
    [3000, 'Но одно не изменилось —\nты до сих пор заставляешь меня улыбаться 😊'],
    [3500, 'И сегодня я хочу сделать кое-что…'],
    [2500, 'Я немного волнуюсь прямо сейчас 💓'],
  ];

  for (const [delay, text] of msgs) {
    await sendTyping(bot, chatId, delay);
    await bot.sendMessage(chatId, text);
  }

  await sendTyping(bot, chatId, 2000);
  await bot.sendMessage(chatId, 'Но мне очень хочется, чтобы ты это увидела…', continueKb);
}

// ─── Финал ────────────────────────────────────────────────────────
async function finaleSequence(bot, chatId) {
  await sendTyping(bot, chatId, 2000);
  await bot.sendMessage(chatId, 'Помнишь то место, где всё началось?.. 💭');

  await sendTyping(bot, chatId, 3000);
  await bot.sendMessage(chatId, 'Кажется, там сейчас кое-что происходит…');

  await sendTyping(bot, chatId, 2500);
  // ⬇️ Замени финальный намёк под себя
  await bot.sendMessage(chatId, 'Проверь сама 👀\n\nПосмотри туда, где всё началось 💖', removeKb);

  userStep.delete(chatId);
}

// ─── Экспорт: запуск бота ─────────────────────────────────────────
function start(app, token) {
  const isRailway = !!process.env.RAILWAY_PUBLIC_DOMAIN;

  const bot = new TelegramBot(token, { polling: !isRailway });

  // Webhook на Railway
  if (isRailway && app) {
    const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
    const path = `/wh/${token.split(':')[0]}`;
    bot.setWebHook(`https://${domain}${path}`);
    app.post(path, (req, res) => {
      bot.processUpdate(req.body);
      res.sendStatus(200);
    });
    console.log('🤖 Bot: webhook mode');
  } else {
    console.log('🤖 Bot: polling mode');
  }

  // ── Обработчик сообщений ──
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text) return;

    const step = userStep.get(chatId);

    // /start
    if (text === '/start') {
      userStep.set(chatId, 0);
      await bot.sendMessage(
        chatId,
        'Привет 💫\n\nУ меня есть кое-что для тебя…\nНо сначала — маленькая игра. Готова?',
        kb(['Давай! 💖'])
      );
      return;
    }

    if (step === undefined) {
      await bot.sendMessage(chatId, 'Напиши /start, чтобы начать 😊', removeKb);
      return;
    }

    // Шаг 0 → Вопрос 1
    if (step === 0 && text === 'Давай! 💖') {
      userStep.set(chatId, 1);
      await sendTyping(bot, chatId, 1500);
      await bot.sendMessage(chatId, 'Окей, вот первый вопрос 🤔\n\nГде мы чаще всего переписываемся?', kb(OPTIONS_1));
    }
    // Вопрос 1
    else if (step === 1) {
      if (text === CORRECT_1) {
        userStep.set(chatId, 2);
        await sendTyping(bot, chatId, 1500);
        await bot.sendMessage(chatId, 'Точно 😌\nТы помнишь…\n\nА теперь скажи — где всё началось? 💭', kb(OPTIONS_2));
      } else {
        await bot.sendMessage(chatId, 'Не совсем 😄\nПодумай ещё разок');
      }
    }
    // Вопрос 2
    else if (step === 2) {
      if (text === CORRECT_2) {
        userStep.set(chatId, 3);
        await bot.sendMessage(chatId, 'Да… 💫', removeKb);
        await emotionalSequence(bot, chatId);
      } else {
        await bot.sendMessage(chatId, 'Хм, не совсем 💭\nПопробуй вспомнить…');
      }
    }
    // Финал
    else if (step === 3 && text === 'Дальше ➡️') {
      userStep.set(chatId, 4);
      await finaleSequence(bot, chatId);
    }
    else if (step === 4) {
      await bot.sendMessage(chatId, '💖', removeKb);
    }
  });
}

module.exports = { start };
