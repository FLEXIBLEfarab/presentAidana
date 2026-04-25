"""
💌 Романтический Telegram-бот на День влюбленных
Бот проводит девушку через мини-игру и эмоциональный сценарий,
в финале — намёк выйти на улицу, где ты ждёшь с подарком.

Запуск: python bot.py
Зависимости: pip install aiogram python-dotenv
"""

import asyncio
import os
from dotenv import load_dotenv

from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import CommandStart
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove

# ─── Загрузка токена ───────────────────────────────────────────────
load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")  # Положи токен в файл .env: BOT_TOKEN=8678339049:AAF...

if not TOKEN:
    raise ValueError("❌ Токен не найден! Создай файл .env с BOT_TOKEN=твой_токен")

# ─── Настраиваемые ответы (замени под себя) ────────────────────────
CORRECT_ANSWER_1 = "WhatsApp"          # Где вы чаще всего общаетесь
CORRECT_ANSWER_2 = "Во дворе"          # Где всё началось (ваш вариант)

# ─── Инициализация бота ───────────────────────────────────────────
bot = Bot(token=TOKEN)
dp = Dispatcher()

# Хранилище состояний пользователей (in-memory)
# Шаги: 0 — старт, 1 — вопрос 1, 2 — вопрос 2, 3 — эмоциональная часть, 4 — финал
user_step: dict[int, int] = {}


# ─── Вспомогательные функции ──────────────────────────────────────

def make_keyboard(options: list[str]) -> ReplyKeyboardMarkup:
    """Генерирует клавиатуру из списка вариантов (каждый — отдельная строка)."""
    return ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text=option)] for option in options],
        resize_keyboard=True,
        one_time_keyboard=True,
    )


def continue_keyboard() -> ReplyKeyboardMarkup:
    """Клавиатура с одной кнопкой 'Дальше'."""
    return make_keyboard(["Дальше ➡️"])


async def typing_pause(message: types.Message, seconds: float = 2.0):
    """Имитация набора текста + пауза для естественности."""
    await bot.send_chat_action(chat_id=message.chat.id, action="typing")
    await asyncio.sleep(seconds)


# ─── Обработчик /start ────────────────────────────────────────────

@dp.message(CommandStart())
async def cmd_start(message: types.Message):
    """Первое сообщение — интрига и приглашение начать."""
    user_id = message.from_user.id
    user_step[user_id] = 0

    await message.answer(
        "Привет 💫\n\n"
        "У меня есть кое-что для тебя…\n"
        "Но сначала — маленькая игра. Готова?",
        reply_markup=make_keyboard(["Давай! 💖"]),
    )


# ─── Основной обработчик сообщений ────────────────────────────────

@dp.message()
async def handle_message(message: types.Message):
    user_id = message.from_user.id
    text = message.text
    step = user_step.get(user_id)

    # Если пользователь не начал — подсказка
    if step is None:
        await message.answer(
            "Напиши /start, чтобы начать 😊",
            reply_markup=ReplyKeyboardRemove(),
        )
        return

    # ── Шаг 0: Нажали «Давай! 💖» — переход к первому вопросу ──
    if step == 0 and text == "Давай! 💖":
        user_step[user_id] = 1
        await typing_pause(message, 1.5)
        await message.answer(
            "Окей, вот первый вопрос 🤔\n\n"
            "Где мы чаще всего переписываемся?",
            reply_markup=make_keyboard(["Instagram", "Telegram", "WhatsApp", "TikTok"]),
        )

    # ── Шаг 1: Вопрос 1 — Где общаемся ──
    elif step == 1:
        if text == CORRECT_ANSWER_1:
            user_step[user_id] = 2
            await typing_pause(message, 1.5)
            await message.answer(
                "Точно 😌\n"
                "Ты помнишь…\n\n"
                "А теперь скажи — где всё началось? 💭",
                # ⬇️ Замени варианты под себя
                reply_markup=make_keyboard(["В университете", "Во дворе", "В интернете", "На вечеринке"]),
            )
        else:
            await message.answer(
                "Не совсем 😄\nПодумай ещё разок",
            )

    # ── Шаг 2: Вопрос 2 — Где всё началось ──
    elif step == 2:
        if text == CORRECT_ANSWER_2:
            user_step[user_id] = 3
            await message.answer(
                "Да… 💫",
                reply_markup=ReplyKeyboardRemove(),
            )
            # ── Эмоциональная часть с задержками ──
            await emotional_sequence(message)
        else:
            await message.answer(
                "Хм, не совсем 💭\nПопробуй вспомнить…",
            )

    # ── Шаг 3: Эмоциональная часть завершена, ждём «Дальше» → финал ──
    elif step == 3 and text == "Дальше ➡️":
        user_step[user_id] = 4
        await finale_sequence(message)

    # ── После финала — бот молчит или мягко завершает ──
    elif step == 4:
        await message.answer(
            "💖",
            reply_markup=ReplyKeyboardRemove(),
        )


# ─── Эмоциональная последовательность ─────────────────────────────

async def emotional_sequence(message: types.Message):
    """
    Серия сообщений с нарастающей эмоцией.
    Каждое сообщение — с паузой, как будто человек набирает текст.
    """
    messages = [
        (2.5, "Знаешь, я иногда вспоминаю тот момент…"),
        (3.0, "И каждый раз думаю — как мне тогда повезло 🍀"),
        (2.5, "С тех пор столько всего было…"),
        (3.0, "Но вот что не изменилось —\nты до сих пор заставляешь меня улыбаться 😊"),
        (3.5, "И сегодня я хочу сделать кое-что для тебя…"),
        (2.5, "Я немного волнуюсь прямо сейчас 💓"),
    ]

    for delay, text in messages:
        await typing_pause(message, delay)
        await message.answer(text)

    # Пауза перед кнопкой
    await typing_pause(message, 2.0)
    await message.answer(
        "Но мне очень хочется, чтобы ты это увидела…",
        reply_markup=continue_keyboard(),
    )


# ─── Финальная последовательность ─────────────────────────────────

async def finale_sequence(message: types.Message):
    """
    Финал — намёк на то, чтобы она вышла на улицу.
    Без прямого приказа, но с интригой.
    """
    await typing_pause(message, 2.0)
    await message.answer("Помнишь то место, где всё началось?.. 💭")

    await typing_pause(message, 3.0)
    await message.answer("Кажется, там сейчас кое-что происходит…")

    await typing_pause(message, 2.5)
    await message.answer(
        "Проверь сама 👀\n\n"
        # ⬇️ Можешь изменить финальный намёк под своё место
        "Посмотри туда, где всё началось 💖",
        reply_markup=ReplyKeyboardRemove(),
    )

    # Очищаем состояние
    user_id = message.from_user.id
    if user_id in user_step:
        del user_step[user_id]


# ─── Запуск бота ──────────────────────────────────────────────────

async def main():
    print("🚀 Бот запущен!")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())