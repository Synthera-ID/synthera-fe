# Utilities

Folder ini berisi helper functions atau utility functions yang digunakan di berbagai bagian aplikasi.

## Tujuan
Menampung fungsi yang bersifat reusable dan tidak terkait langsung dengan UI.

## Contoh Utilities

- formatter
- validator
- helper functions
- constants

## Contoh Struktur

utils/
 ├ formatCurrency.js
 ├ dateFormatter.js
 ├ validators.js
 └ constants.js

## Contoh Penggunaan

import { formatCurrency } from "@/utils/formatCurrency"

formatCurrency(10000)