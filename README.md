<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# FoodHub

Multi-restaurant food ordering Progressive Web App with offline menu browsing, cart, simulated checkout, and restaurant contact.

## Deployed Application

https://ephraimash.github.io/PWA-siwes-assignment/

## Run Locally

**Prerequisites:** Node.js v24.21.0

```bash
npm install
npm run dev
```

The development server runs at http://localhost:3000.

## Offline Test

1. Run `npm run build` and `npm run preview -- --host 127.0.0.1 --port 4173`.
2. Open http://127.0.0.1:4173/ in a browser and wait for the service worker to register.
3. Disable network access using browser offline/network emulation and reload the page.
4. Confirmed result: the cached FoodHub app loaded successfully and rendered the restaurant list with all five restaurants while offline.
