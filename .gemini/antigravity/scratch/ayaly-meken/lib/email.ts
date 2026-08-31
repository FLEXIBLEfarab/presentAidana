import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER || "abylajmarat51@gmail.com";
const smtpPass = process.env.SMTP_PASS || "baouuwmneicxipkf";

export const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const info = await mailTransporter.sendMail({
      from: `"Ayaly Meken Stays" <${smtpUser}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ""),
    });
    console.log(`[Email sent] to: ${to}, subject: ${subject}, id: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[Email error] failed to send to ${to}:`, error);
    return { success: false, error: error.message };
  }
}

export async function sendBookingConfirmationEmail({
  guestEmail,
  guestName,
  apartmentName,
  apartmentAddress,
  checkInDate,
  checkOutDate,
  totalPrice,
  doorPinCode,
  bookingId,
}: {
  guestEmail: string;
  guestName: string;
  apartmentName: string;
  apartmentAddress: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  doorPinCode?: string | null;
  bookingId: string;
}) {
  const pinBlock = doorPinCode
    ? `
      <div style="margin: 20px 0; padding: 18px; background-color: #ecfdf5; border-radius: 12px; text-align: center; border: 1px solid #6ee7b7;">
        <span style="font-size: 12px; color: #065f46; font-weight: bold; display: block; margin-bottom: 6px;">🔑 ПИН-код умного замка (TTLock):</span>
        <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #064e3b;">${doorPinCode}</span>
        <span style="font-size: 11px; color: #047857; display: block; margin-top: 6px;">Введите код на панели замка и нажмите #</span>
      </div>
    `
    : `
      <div style="margin: 20px 0; padding: 16px; background-color: #f8fafc; border-radius: 12px; text-align: center; border: 1px solid #cbd5e1;">
        <span style="font-size: 13px; color: #334155; font-weight: bold;">🗝️ Передача физических ключей при встрече</span>
        <span style="font-size: 11px; color: #64748b; display: block; margin-top: 4px;">Хозяин апартаментов свяжется с вами по WhatsApp для передачи ключей.</span>
      </div>
    `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="background: #064e3b; padding: 22px; border-radius: 12px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0; font-size: 22px; font-family: Georgia, serif;">Аялы Мекен</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #fde68a;">Ваше бронирование успешно подтверждено!</p>
      </div>
      <div style="padding: 24px 8px; color: #1e293b; line-height: 1.6;">
        <p style="font-size: 15px;">Здравствуйте, <strong>${guestName}</strong>!</p>
        <p>Благодарим вас за выбор сервиса <strong>Аялы Мекен</strong>. Ниже представлены детали вашего бронирования:</p>

        <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin: 16px 0; border: 1px solid #e2e8f0;">
          <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 15px; color: #064e3b;">🏠 ${apartmentName}</p>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">📍 ${apartmentAddress}</p>
          <div style="display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 13px;">
            <span>📅 <strong>Заезд:</strong> ${checkInDate} (c 14:00)</span>
            <span>📅 <strong>Выезд:</strong> ${checkOutDate} (до 12:00)</span>
          </div>
          <p style="margin: 10px 0 0 0; font-size: 14px; font-weight: bold; color: #0f172a;">Сумма к оплате: ${totalPrice.toLocaleString("ru-RU")} ₸</p>
        </div>

        ${pinBlock}

        <div style="text-align: center; margin-top: 24px;">
          <a href="https://ayaly-meken.kz/bookings/${bookingId}" style="display: inline-block; background-color: #064e3b; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-weight: bold; text-decoration: none; font-size: 13px;">
            Открыть цифровой пропуск гостя
          </a>
        </div>

        <p style="margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: center;">
          Служба заботы Ayaly Meken: abylajmarat51@gmail.com
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: guestEmail,
    subject: `✨ Подтверждение бронирования: ${apartmentName} (${checkInDate} — ${checkOutDate})`,
    html,
  });
}
