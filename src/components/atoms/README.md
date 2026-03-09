# Atoms

Atoms adalah komponen UI paling kecil dan dasar.

## Karakteristik
- Tidak memiliki dependensi kompleks
- Digunakan oleh komponen lain
- Biasanya hanya representasi UI

## Contoh Komponen

- Button
- Input
- Label
- Icon
- Text

## Contoh Struktur

atoms/
 ├ Button.jsx
 ├ Input.jsx
 ├ Label.jsx
 └ Icon.jsx

## Contoh Penggunaan

import Button from "@/components/atoms/Button"

<Button variant="primary">
  Submit
</Button>