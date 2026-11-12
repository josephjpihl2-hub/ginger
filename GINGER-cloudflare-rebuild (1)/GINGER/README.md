# GINGER — Cloudflare starter

This is a fresh React/Vite rebuild of the GINGER browser homepage and browser shell.

## What works now
- Responsive Ginger home screen and tabs
- Search/address bar (DuckDuckGo search)
- Shortcuts including Raccoon Game
- Local guest bookmarks, history, and light/dark theme
- Settings panel

## What is not live yet
This starter does **not** pretend an iframe is a proxy. The page navigation currently opens destinations directly in a new browser tab from the placeholder page. To load sites *inside* GINGER through Scramjet, you still need a compatible Scramjet + Wisp Node service deployed to a cloud host and the controller/service-worker integration completed. Cloudflare Pages hosts the frontend but does not run your existing Node Wisp server unchanged.

## Host it so your PC can be off
1. Create a GitHub repository and upload the contents of this folder.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Select your repository.
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Deploy. Your site then runs from Cloudflare's servers; your PC can be off.
7. Connect your domain under the Pages project → Custom domains.

## Next integrations
- Supabase for accounts and syncing bookmarks/history across devices.
- Cloud-hosted Scramjet + Wisp service for real embedded proxy browsing.
- Raccoon Game can be added as a browser shortcut, but whether its streaming player works embedded depends on whether Raccoon offers a web player and permits iframe embedding. The Android app itself cannot simply be embedded.
