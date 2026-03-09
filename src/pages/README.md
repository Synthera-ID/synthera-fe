# Pages

Folder ini berisi halaman berbasis Pages Router.

## Catatan Penting
Next.js memiliki dua sistem routing:

- App Router → src/app
- Pages Router → src/pages

Jika proyek menggunakan App Router, folder ini biasanya digunakan untuk:

- API Routes
- Legacy pages
- Integrasi lama

## Contoh

pages/
 └ api/
    └ auth.js

## API Route Example

export default function handler(req, res) {
  res.status(200).json({ message: "API running" })
}