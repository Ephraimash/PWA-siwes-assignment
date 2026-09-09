<div align="center">

# FoodHub

Multi-restaurant food ordering Progressive Web App for browsing restaurants, exploring menus, building a cart, and placing simulated orders.

</div>

## Deployed Application

Open the deployed app at:

https://ephraimash.github.io/PWA-siwes-assignment/

## Requirements

- Node.js `v24.21.0`
- npm

## Install and Run

```bash
npm install
npm run dev
```

The development server is available at http://localhost:3000.

## Available Commands

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build and service worker
npm run preview   # Preview the production build
npm run lint      # Run the TypeScript type check
```

## Offline Test

The following test was performed against the production preview:

1. Run `npm run build`.
2. Run `npm run preview -- --host 127.0.0.1 --port 4173`.
3. Open http://127.0.0.1:4173/ in a browser and wait for the service worker to register.
4. Disable network access using browser offline/network emulation.
5. Reload the page.

Result: the cached FoodHub application loaded successfully while offline and displayed the restaurant list containing all five restaurants.
