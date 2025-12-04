This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Backend API configuration

The login flow (and any authenticated pages) calls the NestJS backend using the
`NEXT_PUBLIC_API_BASE_URL` environment variable. Create a `.env.local` file with:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

If the variable is not defined, the frontend defaults to `http://localhost:4000` when
hitting `/auth/login`.

## Local Minio uploads

Auction creation uploads the banner via `POST /api/upload/banner`, which proxy the file
into your local Minio instance and returns a public URL that is stored on the backend.
Configure at minimum:

```
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=yukiauction-banners
MINIO_REGION=us-east-1
MINIO_PUBLIC_URL=http://localhost:9000
```

The route will automatically create the bucket if it does not exist, but Minio must be
running and accessible at `MINIO_ENDPOINT`.
