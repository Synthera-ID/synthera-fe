# App Directory

Folder ini berisi routing utama aplikasi menggunakan App Router dari Next.js.

## Fungsi
Mengatur halaman, layout, dan struktur navigasi aplikasi.

## Isi Umum
- `page.jsx` → halaman utama untuk route
- `layout.jsx` → layout global atau layout per route
- `loading.jsx` → komponen loading
- `error.jsx` → halaman error
- `not-found.jsx` → halaman 404

## Contoh Struktur

app/
 ├ dashboard/
 │  ├ page.jsx
 │  └ layout.jsx
 ├ login/
 │  └ page.jsx
 └ layout.jsx

- Setiap folder itu menggambarkan path yang akan diakses di website
- Setiap file didalam folder harus memiliki `page.jsx` dengan penamaan yang sesuai, tidak bisa asal.    
## Catatan
Routing di folder ini bersifat file-based routing.