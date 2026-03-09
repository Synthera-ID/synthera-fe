# Components

Folder ini berisi semua komponen UI yang digunakan dalam aplikasi.

## Tujuan
Memisahkan komponen agar mudah digunakan ulang (reusable).

## Struktur
Menggunakan pendekatan Atomic Design:

- atoms → komponen kecil
- molecules / organisms → komponen gabungan
## Contoh

components/
 ├ atoms/
 ├ organisms/
 └ README.md

## Best Practice
- Komponen harus reusable
- Hindari logic bisnis berat di dalam komponen
- Gunakan props untuk konfigurasi komponen