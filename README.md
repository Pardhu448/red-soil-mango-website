# Red Soil Mango — website

A React (Create React App + TypeScript) website for the Red Soil Mango farm,
served as static files on **Google App Engine**.

## Local development

```bash
npm install
npm start
```

Runs the dev server at http://localhost:3000.

## Environment variables

The Order page form posts to a Google Apps Script backend. Create a `.env`
file in the project root:

```
REACT_APP_ORDER_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
```

`.env` is git-ignored. The variable is read at **build time**, so it must be
present when you run `npm run build` for it to work in production. See
[`apps-script/README.md`](apps-script/README.md) for setting up the backend.

## Deploying to App Engine

The app is served as static files — App Engine does **not** build it for you
(the `gcp-build` npm script is intentionally empty). You build locally, then
deploy the result.

### Prerequisites

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (`gcloud`)
- Authenticated and pointed at the right project:
  ```bash
  gcloud auth login
  gcloud config set project <YOUR_PROJECT_ID>
  ```

### Steps

```bash
npm install          # if dependencies changed
npm run build        # compiles to build/  (needs .env for the order form)
gcloud app deploy
```

Then open it:

```bash
gcloud app browse
```

### How it works

- **`app.yaml`** — `nodejs20` runtime. Static handlers serve hashed assets
  (js/css/images) from `build/`, and route everything else to
  `build/index.html` so client-side React Router works. All routes use
  `secure: always` (HTTPS).
- **`.gcloudignore`** — controls what gets uploaded. It must exist so gcloud
  does not fall back to `.gitignore`, which excludes `build/` — the very
  folder App Engine serves.

### Important

- Always run `npm run build` **before** `gcloud app deploy`. Deploying with a
  stale or missing `build/` ships old or broken output.

## Google site verification

If you need to verify the domain for Google Search Console, use one of these
two methods — there is **no `app.yaml` handler** for verification:

- **DNS** — add the `TXT` record Google provides to your domain's DNS settings.
  Recommended, since it is independent of how the site is deployed.
- **HTML meta tag** — paste the `<meta name="google-site-verification" ...>`
  tag Google provides into the `<head>` of `public/index.html`, then rebuild
  and redeploy.

Avoid the HTML *file upload* method: the `/.*` catch-all in `app.yaml` routes
every unknown path to `index.html`, so a standalone verification file would
not be served.

## Project structure

```
src/                React app (pages, components, images)
public/             CRA static template
build/              Production output (generated; served by App Engine)
apps-script/        Order form backend (Google Apps Script) + its setup guide
app.yaml            App Engine config
.gcloudignore       Files excluded from App Engine uploads
```
