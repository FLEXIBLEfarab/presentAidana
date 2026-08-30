import nodemailer from "nodemailer";

function getTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

const DEFAULT_FROM = process.env.SMTP_FROM || '"Ayaly Meken" <support@ayaly-meken.kz>';

/**
 * 1. Booking Confirmation Email to Guest
 */
export async function sendBookingConfirmationEmail(params: {
  to: string;
  guestName: string;
  apartmentName: string;
  address: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  depositAmount: number;
  bookingNumber: string;
}) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`\n📧 [DEV EMAIL: Booking Confirmation]\nTo: ${params.to}\nGuest: ${params.guestName}\nApartment: ${params.apartmentName}\nBooking #: ${params.bookingNumber}\nTotal: ${params.totalPrice} ₸\n`);
    return { success: true, devMode: true };
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; background-color: #fcfbf7; border: 1px solid #e7e5df; border-radius: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 10px 20px; background-color: #064e3b; color: #fef3c7; font-weight: 800; font-size: 20px; border-radius: 16px; letter-spacing: -0.5px;">
          Ayaly Meken
        </div>
        <p style="color: #78716c; font-size: 13px; margin: 8px 0 0 0;">Премиальный сервис бесконтактной аренды</p>
      </div>

      <div style="background-color: #ffffff; padding: 28px; border-radius: 20px; border: 1px solid #e7e5df; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <h2 style="color: #064e3b; font-size: 18px; font-weight: 700; margin-top: 0;">Ваше бронирование подтверждено! 🎉</h2>
        <p style="color: #44403c; font-size: 14px; line-height: 1.5;">
          Здравствуйте, <strong>${params.guestName}</strong>!<br/>
          Мы забронировали для вас апартаменты: <strong>${params.apartmentName}</strong>.
        </p>

        <div style="background-color: #f7f6f0; border-radius: 16px; padding: 18px; margin: 20px 0; font-size: 13px; line-height: 1.6; color: #292524;">
          <div>📍 <strong>Адрес:</strong> ${params.address}</div>
          <div>📅 <strong>Заезд:</strong> ${params.checkIn} (с 14:00)</div>
          <div>📅 <strong>Выезд:</strong> ${params.checkOut} (до 12:00)</div>
          <div>🧾 <strong>Номер брони:</strong> #${params.bookingNumber}</div>
          <div>💳 <strong>Сумма проживания:</strong> ${params.totalPrice.toLocaleString("ru-RU")} ₸</div>
          <div>🛡️ <strong>Страховой залог:</strong> ${params.depositAmount.toLocaleString("ru-RU")} ₸ (возврат в течение 2ч после выезда)</div>
        </div>

        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 16px; padding: 16px; text-align: center;">
          <span style="font-size: 12px; font-weight: bold; color: #065f46; display: block; margin-bottom: 4px;">Бесконтактный умный заезд (TTLock):</span>
          <span style="font-size: 13px; color: #047857;">Ваш персональный цифровой ПИН-код от дверного замка будет отправлен за 1 час до заезда в SMS и на эту почту.</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px; color: #a8a29e; font-size: 11px;">
        Служба заботы Ayaly Meken 24/7 · WhatsApp: +7 (707) 144-82-67
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: DEFAULT_FROM,
      to: params.to,
      subject: `✅ Подтверждение бронирования #${params.bookingNumber} — Ayaly Meken`,
      html,
    });
    return { success: true };
  } catch (err: any) {
    console.error("Email send error:", err);
    return { success: false, error: err?.message };
  }
}

/**
 * 2. TTLock Smart Door Pin Email to Guest
 */
export async function sendLockPinEmail(params: {
  to: string;
  guestName: string;
  apartmentName: string;
  pinCode: string;
  checkInDate: string;
  checkOutDate: string;
}) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`\n🔑 [DEV EMAIL: TTLock PIN Code]\nTo: ${params.to}\nGuest: ${params.guestName}\nPIN: ${params.pinCode}\n`);
    return { success: true, devMode: true };
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 20px; background-color: #fcfbf7; border: 1px solid #e7e5df; border-radius: 24px;">
      <div style="background-color: #ffffff; padding: 28px; border-radius: 20px; border: 1px solid #e7e5df; text-align: center;">
        <div style="font-size: 36px; margin-bottom: 12px;">🔑</div>
        <h2 style="color: #064e3b; font-size: 19px; font-weight: 800; margin: 0 0 10px 0;">Ваш ключ от апартаментов</h2>
        <p style="color: #57534e; font-size: 13px; margin: 0 0 20px 0;">
          ${params.apartmentName}
        </p>

        <div style="background-color: #ecfdf5; border: 2px dashed #059669; border-radius: 18px; padding: 20px; margin: 20px 0;">
          <span style="font-size: 11px; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px;">ПИН-код электронного замка:</span>
          <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #064e3b; font-family: monospace;">${params.pinCode}</span>
        </div>

        <div style="text-align: left; background-color: #f7f6f0; border-radius: 14px; padding: 14px 18px; font-size: 12px; color: #44403c; line-height: 1.6;">
          <strong>Как открыть замок:</strong><br/>
          1. Коснитесь сенсорной панели замка рукой, чтобы включить подсветку.<br/>
          2. Введите ваш 6-значный код: <strong>${params.pinCode}</strong> и нажмите <strong>#</strong>.<br/>
          3. Замок издаст звуковой сигнал и откроет дверь.
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: DEFAULT_FROM,
      to: params.to,
      subject: `🔑 Ваш ПИН-код от замка (${params.pinCode}) — ${params.apartmentName}`,
      html,
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
