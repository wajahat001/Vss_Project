# Frontend

Vite + React frontend. Run:

```bash
cd frontend
npm install
npm run dev
```

## Vercel deployment

Deploy this folder as the Vercel project root.

Set `VITE_API_URL` in Vercel to the deployed backend URL, for example `https://your-backend.example.com`.

The included `vercel.json` enables client-side routing so direct visits to routes like `/dashboard` or `/reports` resolve correctly.
