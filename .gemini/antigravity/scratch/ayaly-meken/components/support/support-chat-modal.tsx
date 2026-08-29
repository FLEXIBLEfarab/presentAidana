"use client";

import React, { useState } from "react";
import {
  X,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  HelpCircle,
  KeyRound,
  Clock,
  CreditCard,
  Wifi,
  CheckCircle2,
  Bot,
  User,
} from "lucide-react";

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "agent";
  text: string;
  time: string;
}

const FAQ_PRESETS = [
  {
    icon: KeyRound,
    label: "Где взять ПИН-код от замка?",
    answer: "ПИН-код генерируется автоматически после подтверждения оплаты и доступен во вкладке «Мои поездки», а также отправляется в SMS и WhatsApp за 1 час до заезда (14:00).",
  },
  {
    icon: Clock,
    label: "Как продлить проживание / поздний выезд?",
    answer: "Продлить проживание можно прямо в приложении во вкладке «Мои поездки» при наличии свободных дат или написав нам в чат. Стандартный поздний выезд до 15:00 рассчитывается по тарифу 50% стоимости суток.",
  },
  {
    icon: CreditCard,
    label: "Когда возвращается страховой депозит?",
    answer: "Страховой депозит возвращается на ваш Kaspi / карту автоматически в течение 2 часов после выезда и завершения чек-листа горничной.",
  },
  {
    icon: Wifi,
    label: "Какой пароль от Wi-Fi?",
    answer: "Название сети и пароль от высокоскоростного Wi-Fi указаны в карточке вашей брони («Мои поездки») и на информационной табличке внутри квартиры.",
  },
];

export function SupportChatModal({ isOpen, onClose }: SupportChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "Здравствуйте! 👋 Я цифровой консьерж Ayaly Meken. Чем я могу помочь вам прямо сейчас?",
      time: "Только что",
    },
  ]);
  const [inputText, setInputText] = useState("");

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    // Simulate smart support bot response
    setTimeout(() => {
      let botResponse = "Спасибо за обращение! Оператор службы заботы уже подключился к вашему запросу. Мы ответим в течение 1–2 минут.";
      
      const lower = text.toLowerCase();
      if (lower.includes("пин") || lower.includes("код") || lower.includes("замок") || lower.includes("ключ")) {
        botResponse = "🔑 ПИН-код от электронного замка двери доступен во вкладке «Мои поездки». Если код не сработал, нажмите * на клавиатуре замка для сброса и введите 6 цифр снова.";
      } else if (lower.includes("депозит") || lower.includes("залог") || lower.includes("возврат")) {
        botResponse = "💳 Страховой депозит возвращается в течение 2 часов после выезда на ваш Kaspi Gold / номер телефона.";
      } else if (lower.includes("вайфай") || lower.includes("wi-fi") || lower.includes("интернет")) {
        botResponse = "📶 Сеть и пароль Wi-Fi доступны в карточке бронирования. Роутер находится в гостиной зоне.";
      } else if (lower.includes("уборк") || lower.includes("полотенц")) {
        botResponse = "🧹 Заявка на дополнительный клининг или замену белья принята! Администратор свяжется с вами для согласования времени.";
      }

      const replyMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-emerald-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sand-300 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-sand-200 bg-gradient-to-r from-emerald-950 to-emerald-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Bot size={22} />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-sans text-sm sm:text-base font-bold text-white">
                  Служба заботы Ayaly Meken
                </h3>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                  24/7 Онлайн
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                Консьерж-сервис, замки TTLock и помощь гостям
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-emerald-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Emergency Channel Bar */}
        <div className="flex items-center justify-between bg-sand-100 px-4 py-2 text-xs border-b border-sand-200 shrink-0">
          <span className="text-[11px] font-semibold text-stone-600">Срочный вопрос?</span>
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/77071448267?text=Здравствуйте!%20Мне%20нужна%20помощь%20по%20бронированию%20в%20Ayaly%20Meken"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-all"
            >
              <MessageCircle size={12} />
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:+77071448267"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-sand-200 text-stone-800 text-[11px] font-bold border border-sand-300 shadow-xs transition-all"
            >
              <Phone size={12} />
              <span>Позвонить</span>
            </a>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-sand-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                  msg.sender === "user"
                    ? "bg-stone-900 text-white"
                    : "bg-emerald-800 text-amber-300 font-bold"
                }`}
              >
                {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                  msg.sender === "user"
                    ? "bg-emerald-900 text-white rounded-tr-xs"
                    : "bg-white border border-sand-200 text-stone-800 rounded-tl-xs"
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block text-[9px] mt-1 ${
                    msg.sender === "user" ? "text-emerald-200 text-right" : "text-stone-400"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* Quick FAQ Chips */}
          <div className="pt-2 space-y-1.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Частые вопросы:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {FAQ_PRESETS.map((faq, i) => {
                const Icon = faq.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(faq.label)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-sand-200 hover:border-emerald-700 hover:bg-emerald-50 text-[11px] font-semibold text-stone-700 transition-all cursor-pointer"
                  >
                    <Icon size={12} className="text-emerald-700" />
                    <span>{faq.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-sand-200 bg-white flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Напишите сообщение службе заботы..."
            className="flex-1 h-11 px-4 rounded-2xl border border-sand-300 bg-sand-50/50 text-xs font-semibold text-stone-900 outline-none focus:bg-white focus:border-emerald-700 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-11 h-11 rounded-2xl bg-emerald-950 hover:bg-emerald-900 disabled:opacity-40 text-cream-50 flex items-center justify-center shadow-md transition-all cursor-pointer shrink-0"
          >
            <Send size={16} className="text-amber-300" />
          </button>
        </form>
      </div>
    </div>
  );
}
