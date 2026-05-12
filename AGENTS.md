# AGENTS.md

## Project Instruction - Synthera Frontend

Anda adalah AI Software Engineer untuk project Synthera Frontend.

Ikuti aturan berikut saat melakukan generate code, refactor, atau penambahan fitur.

---

# GLOBAL RULES

- Gunakan Next.js App Router
- Gunakan TypeScript
- Gunakan TailwindCSS
- Gunakan component reusable
- Gunakan clean architecture
- Gunakan naming convention yang konsisten
- Jangan merusak existing structure
- Jangan menghapus feature lama
- Semua UI harus responsive
- Gunakan dark/light mode support
- Gunakan modular folder structure
- Gunakan shadcn/ui jika tersedia
- Semua modal wajib reusable
- Semua table wajib responsive
- Gunakan loading state dan empty state
- Gunakan toast notification jika diperlukan

---

# FEATURE TASKS

## 1. Subscription History

Tambahkan history pembelian subscription.

Field yang wajib:
- created_by
- created_at
- updated_by
- updated_at

Requirement:
- tampilkan dalam table
- support pagination
- support search
- support sorting
- gunakan badge untuk status subscription
- gunakan date formatter yang rapi

---

## 2. Dark / Light Theme
di semua halaman tambahkan tombol untuk mengubah tema dark/light mode
Tambahkan fitur:
- dark mode
- light mode

Requirement:
- toggle di navbar/header
- simpan preference menggunakan localStorage
- gunakan smooth transition
- semua halaman support dark mode

---

## 3. Logout Notification Modal

Ubah alert logout menjadi modal notification modern.

Requirement:
- gunakan confirmation modal
- tombol:
  - cancel
  - logout
- gunakan animation
- modal reusable

---

## 4. Digital Content CRUD

Tambahkan:
- button add content
- modal create content
- CRUD digital content

Field:
- title
- description
- thumbnail
- category
- status
- created_at

Requirement:
- validation form
- preview image
- loading state
- toast notification
- reusable modal component

---

## 5. Add Course Menu in Sidebar

Tambahkan menu:
- Course

Requirement:
- icon sidebar
- active state
- responsive sidebar
- support collapse sidebar

---

## 6. Course Curriculum Accordion

Tambahkan accordion pada list kurikulum.

Isi accordion:
- video
- penjelasan materi

Requirement:
- smooth animation
- expandable accordion
- modern UI
- support multiple curriculum item

Structure:
Course
 └── Section
      └── Video
      └── Description

---

## 7. Transaction Management

Ganti:
- Payment History

Menjadi:
- Transaction Management

Requirement:
- transaction history
- filtering
- search
- pagination
- transaction status badge
- export data jika memungkinkan

---

## 8. Management Sidebar Group

Tambahkan sidebar baru:
- Management

Isi menu:
- User Management
- Payment Management
- Transaction Management
- Subscription Management
- Membership Management

Requirement:
- gunakan grouped menu
- support dropdown/collapse
- modern admin dashboard style
- icon tiap menu
- active route detection

---

# UI/UX STYLE

Gunakan style modern 2025:
- glassmorphism jika cocok
- rounded-xl / rounded-2xl
- shadow soft
- spacing rapi
- hover animation
- smooth transition
- minimalis professional dashboard

Color:
- gunakan neutral modern palette
- support dark mode

---

# CODING RULES

- Hindari hardcode
- Gunakan constants
- Pisahkan logic dan UI
- Gunakan hooks jika perlu
- Gunakan reusable types/interface
- Gunakan async await
- Gunakan folder modular

---

# OUTPUT RULES

Saat generate code:
- jelaskan file yang dibuat
- jelaskan perubahan
- jangan generate file yang tidak diperlukan
- pastikan tidak conflict dengan existing codebase
- prioritaskan maintainability