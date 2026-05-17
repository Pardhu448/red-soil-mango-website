# Order form backend — setup guide

The Order page form posts to a Google Apps Script Web App that logs the order
to a Google Sheet and emails you an order notification via Resend.

## 1. Set up Resend (email notifications)

1. Create an account at <https://resend.com/>.
2. Add and **verify your domain** under `Domains` (add the DNS records Resend
   shows). The notification sender address must be on a verified domain.
   - For quick testing without a domain you can use the built-in
     `onboarding@resend.dev` sender — but it only delivers to the email of
     your own Resend account.
3. Create an **API key** under `API Keys` (starts with `re_`). Copy it.

## 2. Create the Google Sheet + Apps Script

1. Create a new Google Sheet (this is where orders are logged).
2. In the Sheet: `Extensions > Apps Script`.
3. Replace the default `Code.gs` contents with the file `apps-script/Code.gs`
   from this repo.
4. In Apps Script: `Project Settings (gear) > Script Properties`, add:
   - `RESEND_API_KEY` = the API key from step 1
   - `FROM_EMAIL` = a verified sender, e.g.
     `Red Soil Mango <orders@yourdomain.com>` (or `onboarding@resend.dev`)
   - `OWNER_EMAIL` = the address that should receive new-order alerts
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

## Emailing individual customers

The order form has an optional **Email** field; addresses customers provide
are logged in the `Email` column of the `Orders` sheet.

After the script is installed, reopen the Google Sheet. A **Mango Tools** menu
appears next to `Help`. The script uses two extra columns on the `Orders`
sheet, **auto-created** the first time you run it:

- **Messages** — a pipe-separated message history for that customer, **newest
  first**. To send a customer a new message, type it at the *front* of the
  cell, separated from the older ones with `|`:

  ```
  Your mangoes ship tomorrow | Thanks for your order! | Order received
  ```

  The script always sends the **first** entry; the rest are kept as history.

- **Send?** — set this to `send` (or tick it, if you make it a checkbox) on
  each row you want emailed.

Then choose **Mango Tools > Send pending customer emails**. For every row with
`Send?` set, the script emails the newest message to that row's `Email`
address, then stamps the cell `Sent <date>` so it is not sent again. To
message that customer again later, prepend a new message and set `Send?` once
more. Rows with no email or no message are skipped.

> The menu only appears after the Sheet is reloaded (the `onOpen` trigger runs
> on open). The first run will ask you to authorize the script.

## Notes

- The Sheet tab must be named `Orders` (the script auto-creates it with
  headers on the first submission if missing).
- If Resend is not configured (any of the three properties missing), orders
  are still saved to the Sheet; only the email notification is skipped.
- If you reuse an **existing** Orders sheet from before this change, add an
  `Email` column header — the script writes new orders' emails there and reads
  it when sending customer emails.
