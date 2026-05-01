import os
import json
import smtplib
import urllib.request
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта HashVault на почту и в Telegram."""

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    contact = body.get("contact", "").strip()
    budget = body.get("budget", "").strip()
    message = body.get("message", "").strip()

    if not name or not contact:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Имя и контакт обязательны"}),
        }

    errors = []

    # --- Telegram ---
    try:
        bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
        chat_id = "@Artem299999"

        text = (
            f"🔔 *Новая заявка с HashVault*\n\n"
            f"👤 *Имя:* {name}\n"
            f"📞 *Контакт:* {contact}\n"
            f"💰 *Бюджет:* {budget or 'не указан'}\n"
            f"💬 *Сообщение:* {message or 'нет'}"
        )

        tg_payload = json.dumps({
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "Markdown",
        }).encode("utf-8")

        tg_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        req = urllib.request.Request(tg_url, data=tg_payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            tg_result = json.loads(resp.read())
            if not tg_result.get("ok"):
                errors.append(f"Telegram: {tg_result.get('description')}")
    except Exception as e:
        errors.append(f"Telegram error: {str(e)}")

    # --- Email (Gmail SMTP) ---
    try:
        smtp_password = os.environ.get("SMTP_PASSWORD", "")
        from_email = "sadkovartem2004@gmail.com"
        to_email = "sadkovartem2004@gmail.com"

        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[HashVault] Новая заявка от {name}"
        msg["From"] = from_email
        msg["To"] = to_email

        html_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0C12; color: #fff; padding: 32px; border-radius: 16px;">
          <div style="background: #F5C542; color: #0A0C12; padding: 8px 16px; border-radius: 8px; display: inline-block; font-weight: bold; margin-bottom: 24px;">
            🔔 Новая заявка с HashVault
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #252A3A; color: #9CA3AF; width: 120px;">Имя</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #252A3A; font-weight: bold;">{name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #252A3A; color: #9CA3AF;">Контакт</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #252A3A;">{contact}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #252A3A; color: #9CA3AF;">Бюджет</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #252A3A;">{budget or "не указан"}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #9CA3AF; vertical-align: top;">Сообщение</td>
              <td style="padding: 12px 0;">{message or "нет"}</td>
            </tr>
          </table>
          <p style="margin-top: 24px; color: #6B7280; font-size: 12px;">Это письмо отправлено автоматически с сайта HashVault</p>
        </div>
        """

        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(from_email, smtp_password)
            server.sendmail(from_email, to_email, msg.as_string())
    except Exception as e:
        errors.append(f"Email error: {str(e)}")

    if errors:
        return {
            "statusCode": 207,
            "headers": cors_headers,
            "body": json.dumps({"ok": False, "errors": errors}),
        }

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"ok": True, "message": "Заявка отправлена"}),
    }
