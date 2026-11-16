# TEMPLY — GitHub-ready digital product storefront

A mobile-friendly Next.js App Router starter for the TEMPLY digital product store. It includes a complete demo storefront, five original PDF playbooks and matching SVG covers, Supabase schema, Razorpay server routes, and Codespaces/Vercel setup files.

> **Honest feature status:** The storefront and demo browsing work without paid credentials. Demo checkout deliberately does not take or simulate money. The Razorpay order/signature/webhook API routes are implemented, but production fulfilment is not complete: before accepting real payments, finish Supabase Auth/admin roles, private Storage signed-download endpoint, email provider, and transactional order/download workflow. The admin screen is a demo editor only; it does not persist changes to Supabase. No fake purchases, reviews, or analytics are shown.

## 1. Run in GitHub Codespaces (Android-friendly)

1. Download and extract this ZIP, or upload the project folder contents into a new GitHub repository named `temply`.
2. On GitHub, open the repository. Tap **Code → Codespaces → Create codespace on main**.
3. Wait until the VS Code web editor finishes loading. The included devcontainer installs Node.js 22 and runs `npm install` after creation.
4. Open the menu (☰) → **Terminal → New Terminal**. If dependencies were not installed automatically, run:

   ```bash
   npm install
   ```
5. Start the site:

   ```bash
   npm run dev
   ```
6. Open the **Ports** tab, find port **3000**, and tap the forwarded URL / globe icon. If prompted, choose **Open in Browser**. The site should show TEMPLY.
7. Stop the server with `Ctrl + C` in the terminal.

If the Codespace has already opened and says “Setting up your codespace”, wait for the setup process to finish before running commands. On a phone, rotate to landscape if the terminal or Ports tab is difficult to reach.

## 2. Local demo defaults

No credentials are required for the demo storefront. Optional environment variables can be added by copying `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

For demo mode keep:

```env
NEXT_PUBLIC_APP_MODE=demo
```

The default demo admin password is `change-me`. Change it in `.env.local` using `DEMO_ADMIN_PASSWORD=your-strong-password`, restart the server, and visit `/admin`. This is a lightweight demo gate only, not production-grade authentication. Demo edits are not persisted across reloads or devices.

## 3. Included routes

- `/` — homepage and bundle offer
- `/products` — product library
- `/bundle` — five-guide bundle page
- `/products/[slug]` — product detail and preview
- `/checkout` — demo checkout; clearly reports that no payment was taken
- `/success` — informational page; does not claim payment success by itself
- `/download` — generic secure-delivery information page
- `/admin` — demo-only editor/dashboard
- `/faq`, `/contact`, `/privacy`, `/terms`, `/refund`
- `/api/health` — configuration status
- `/api/razorpay/order`, `/api/razorpay/verify`, `/api/razorpay/webhook`

## 4. Original digital products

Five PDF files are in `public/products/` and five matching SVG covers are in `public/images/`:

1. Conversation Starter Playbook — ₹99
2. Flirting Mastery Guide — ₹79
3. Texting Psychology Guide — ₹99
4. Relationship Red Flags Guide — ₹99
5. 30-Day Confidence Challenge — ₹149

Bundle display price: ₹299. The guides promote respectful communication and do not promise romantic outcomes. Product PDF files are included in this starter's public assets for preview/testing. **Before launch**, move paid PDFs into a private Supabase Storage bucket and remove the public copies from the deployed build.

## 5. Supabase setup (production work required)

1. Create a Supabase project.
2. Open **SQL Editor**, paste and run `supabase/schema.sql`.
3. In Storage, create a bucket named `paid-products` and set it to **Private**.
4. Add these server-side environment variables in Codespaces/Vercel:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
   SUPABASE_STORAGE_BUCKET=paid-products
   ```

5. Never put the service-role key in a `NEXT_PUBLIC_` variable or commit `.env.local`.
6. The schema enables RLS and intentionally creates no public write policies. Implement Supabase Auth, an `admin` role, and narrowly scoped policies before enabling a production admin panel. The current `/admin` page is intentionally demo-only.
7. Upload each PDF to the private bucket and implement a server route that checks a paid order, verifies ownership (e.g. email + signed order token), and returns a short-lived signed URL. Do not expose permanent public file URLs.

## 6. Razorpay test mode

1. Create a Razorpay account and enable test mode.
2. Copy the test Key ID and Key Secret from the dashboard.
3. Configure:

   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   RAZORPAY_WEBHOOK_SECRET=...
   NEXT_PUBLIC_APP_MODE=production
   ```

4. Set a webhook URL to `https://YOUR_DOMAIN/api/razorpay/webhook`, subscribe to `payment.captured` and `payment.failed`, and use the same webhook secret in the environment.
5. The server creates INR orders, verifies Razorpay's payment signature and handles signed webhook events. The order table is used to prevent a duplicate paid transition. **Do not accept live payments yet:** add a verified download-entitlement/token table, signed private-storage download endpoint, email delivery, refund handling, and end-to-end tests before switching to live keys. Also add rate limiting and monitoring.
6. Never expose `RAZORPAY_KEY_SECRET` or webhook secret to the browser.

## 7. Vercel deployment

1. Push the repository to GitHub.
2. Sign in to Vercel → **Add New → Project** → import the `temply` repository.
3. Framework preset: Next.js. Build command: `npm run build` (default is also fine); output directory: leave default.
4. Add environment variables from `.env.example` in Project Settings → Environment Variables. Start with demo mode if you only want a preview.
5. Deploy. Vercel will build from GitHub; future pushes trigger deployments.
6. Add your domain in Project Settings → Domains and follow the DNS records Vercel provides. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS URL and redeploy.
7. Configure Razorpay webhook with the production domain only after the payment and fulfilment flow is complete and tested.

## 8. Testing

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

Then open `/api/health` to see whether credentials are detected. Test the product pages and demo checkout. Without credentials, the checkout must report demo mode and must not create a payment. For a real test transaction, use Razorpay test credentials and a configured Supabase database.

This project has not been connected to your GitHub account, Supabase project, Razorpay account or Vercel account. No deployment or external account setup is claimed.

## 9. Production checklist still to complete

- Supabase Auth sign-in, role/claim-based admin authorization and RLS policies.
- Persist product edits, coupons, approved reviews, homepage sections, popup settings and email templates.
- Secure file upload validation (MIME/type/size), private storage, signed download entitlements and expiring tokens.
- Transactional email provider integration and delivery/retry logging.
- Real verified-purchase popup sourced only from paid orders; discount/newsletter popups with consent and frequency caps. No fabricated scarcity or social proof.
- Refund/chargeback workflows, privacy/terms review, India tax/invoice considerations, rate limiting, audit logs and monitoring.
- Automated tests for order idempotency, webhook replay, payment failure, download ownership and mobile layouts.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — production server
- `npm run typecheck` — TypeScript check
- `python scripts/create_products.py` — regenerate the included PDF playbooks (requires ReportLab)
