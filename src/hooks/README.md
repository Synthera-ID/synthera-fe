# Custom Hooks

Folder ini berisi custom React Hooks untuk logic yang dapat digunakan ulang.

## Tujuan
Memisahkan logic dari komponen UI.

## Contoh Hooks

- useAuth
- useFetch
- useDebounce
- useLocalStorage

## Contoh Struktur

hooks/
 ├ useAuth.js
 ├ useFetch.js
 └ useDebounce.js

## Contoh Penggunaan

import { useAuth } from "@/hooks/useAuth"

const { user, login } = useAuth()   