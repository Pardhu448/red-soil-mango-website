# Order form backend — setup guide

The Order page form posts to a Google Apps Script Web App that logs the order
to a Google Sheet and sends you a WhatsApp notification via CallMeBot.

## 1. Activate CallMeBot (WhatsApp notifications)

CallMeBot sends WhatsApp messages to **your own number** for free.

1. Add the CallMeBot number **+34 644 51 95 23** to your phone contacts.
2. From the WhatsApp number you want to receive alerts on, send this message
   to that contact: `I allow callmebot to send me messages`
3. You will receive a reply with your personal **API key**. Keep it.

## 2. Create the Google Sheet + Apps Script

1. Create a new Google Sheet (this is where orders are logged).
2. In the Sheet: `Extensions > Apps Script`.
3. Replace the default `Code.gs` contents with the file `apps-script/Code.gs`
   from this repo.
4. In Apps Script: `Project Settings (gear) > Script Properties`, add:
   - `OWNER_PHONE` = your number with country code, digits only, e.g. `919346502175`
   - `CALLMEBOT_APIKEY` = the API key from step 1
5. Save.

## 3. Deploy as a Web App

1. In Apps Script: `Deploy > New deployment`.
2. Type: **Web app**.
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Deploy, authorize when prompted, and copy the **Web app URL**.

> Whenever you change `Code.gs`, create a **New deployment** (or "Manage
> deployments" > edit > new version) — the URL otherwise serves the old code.

## 4. Connect the website

Create a file named `.env` in the project root with:

```
REACT_APP_ORDER_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
```

Use the Web app URL from step 3. Restart `npm start` after creating `.env`.
For the App Engine build, the variable must be present at `npm run build`
time. Do **not** commit `.env` (the repo `.gitignore` already excludes it).

## Notes

- The Sheet tab must be named `Orders` (the script auto-creates it with
  headers on the first submission if missing).
- If CallMeBot is not configured, orders are still saved to the Sheet; only
  the WhatsApp notification is skipped.
- CallMeBot is rate-limited and best-effort — it is fine for low order volume.
  For higher volume or messaging customers, switch `sendWhatsApp_` to Twilio.
