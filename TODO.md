# TODO.md — YukiAuction Frontend Tracker
# Scope: /app routes + shared components (UI-first, API-ready)
# Last updated: sync with backend plan in TODO.backend.md

## 0. Folder Reference (App Router)

- /app/login, /app/signup, /app/otp
- /app/dashboard (layout + sidebar/nav shell)
  - /dashboard/seller/{auctions,items,ads,balance,events,orders}
  - /dashboard/bidder/{wishlist,history,reviews,addresses,cart,shipments}
  - /dashboard/profile
  - /dashboard/notification
- Shared UI lives in /components, data mocks in /lib (needs /data consolidation)

## 1. Core Setup (app/ & components/) — Done

- [x] Next.js 16 App Router + Turbopack baseline
- [x] Global theming + layout primitives (sidebar, navbar, theme toggle)
- [x] Shadcn bundle installed (buttons, form, dialog, tooltip, etc.)
- [x] Dark-mode hydration fix
- [x] Component folders organized (components/auction, components/item, components/ui)

## 2. Auth Routes (/login, /signup, /otp) — Done

- [x] Form layouts + validation hints (UI-only)
- [x] Reusable auth form components
- [x] CTA wiring redirects to /dashboard
- [ ] Hook to backend AuthModule (register/login, refresh) once API is ready (see TODO.backend #2)

## 3. Dashboard Shell (/dashboard layout)

- [x] Sidebar sections (Overview, Seller, Bidder, General)
- [x] Navbar: theme toggle, profile menu, mobile drawer
- [x] Responsive shell with content padding & breadcrumbs
- [ ] Feed layout metrics (counts, alerts) from backend summary endpoints (TODO.backend §16b)
- [ ] Global loading states + skeletons tied to SWR/React Query

## 4. Seller Area (/dashboard/seller/...)

### 4.1 Auctions (/dashboard/seller/auctions)
- [x] Auction list grid/table + actions
- [x] Create Auction page + modal helpers
- [x] Detail page with gallery toggle + ItemCard/ItemRow
- [x] Launch auction modal, edit item modal, lock state for SOLD/READY
- [ ] Wire CRUD to backend AuctionModule (public list/live, private create/update/delete)
- [ ] Surface backend notifications when status changes (TODO.backend §5 + §11)
- [ ] Integrate Bid module data for live auctions (highest bid, remaining time)

### 4.2 Items (/dashboard/seller/items + [id] + edit)
- [x] Grid/List toggle + sorting + dummy koi dataset
- [x] Item detail page with gallery + delete dialog
- [ ] Hook create/edit/delete to backend ItemModule (ownership guard, media list)
- [ ] Connect DeleteItemDialog to real API + optimistic states
- [ ] Add media manager UI using /items/:id/media (TODO.backend §7 & §16b)
- [ ] Show isSold, openBid, buyNow direct from backend instead of mock data

- [x] Responsive shell with hero + action cards (dashboard home refactor)

### 4.3 Ads (/dashboard/seller/ads)
- [x] Build request form untuk pengajuan iklan + metadata sponsor
- [x] Tabel daftar pengajuan + status dan metrik impresi
- [ ] Tie approval/reject states to API once ready

### 4.4 Balance (/dashboard/seller/balance)
- [x] Summary cards + settlement progress UI
- [x] Withdrawal request modal (PIN, tujuan, catatan)
- [x] Payout request list + indikator status

### 4.5 Events (/dashboard/seller/events)
- [ ] Timeline / activity feed hooking to backend Activity logs
- [ ] Filters for bids, carts, notifications

### 4.6 Orders (/dashboard/seller/orders)
- [x] Daftar pesanan dari cart bidder (status packing/pengiriman)
- [x] Form update status + catatan bukti
- [ ] Integrasi ke endpoint Transaction/Cart untuk data nyata

## 5. Bidder Area (/dashboard/bidder/...) — Upcoming

- Wishlist (/wishlist)
  - [x] UI penuh: grid/list toggle, badge status, tombol monitoring board
  - [ ] Render backend data (toggle list + bulk remove)
- History (/history)
  - [x] Tab bid vs transaksi + metrik ringkas
  - [ ] Combine Bid + Transaction API (bid increments, wins, payments)
- Addresses (/addresses)
  - [x] UI form + daftar alamat (default, set default)
  - [ ] Hubungkan dengan Prisma UserAddress
- Reviews (/reviews)
  - [x] Pending review + completed list (rating bintang)
  - [ ] Sambungkan ke SellerReview endpoints
- Cart (/cart + /cart/checkout)
  - [x] Halaman keranjang + countdown pembayaran + flow titip/checkout
  - [x] Form checkout lengkap (alamat, titip, ongkir manual, invoice link)
- Shipments (/shipments)
  - [x] Timeline pengiriman + konfirmasi unboxing/review
  - [ ] Tarik data dari module shipment/transaction
- Monitoring Board (/wishlist/monitor)
  - [x] Grid/list dengan bid control, foto koi, tanda winning
  - [ ] Real-time feed dari Bid module
- Notifications cross-link
  - [ ] Show unread counts fed by backend Notification module (§11)

## 6. General Routes

- /dashboard/profile
  - [ ] Replace placeholder with seller stats, achievements, reviews (UserModule §6, RevenueSummary §19)
  - [ ] Editable bio/social links referencing backend optional fields
- /dashboard/notification
  - [ ] Build notification list + filters, mark-read actions hitting Notification module endpoints (§11)
- /dashboard/overview (if planned)
  - [ ] Summary cards (auctions, items, bids, revenue) consuming dashboard summary API (§16b)
- / landing page + publik
  - [x] Redesign hero, informasi sponsor, testimoni, CTA login/daftar
  - [x] Halaman /auction dan /auction/live dengan feed sponsor & jadwal
  - [x] Halaman /market dengan filter variasi + search
  - [ ] Tarik featured auctions + stats via endpoint publik (§5, §17)

## 7. Cross-cutting UX & Components

- [ ] Centralize dummy data under /data and gradually replace with API hooks
- [ ] Consolidate shared components (AuctionCard, ItemCard, ItemRow, EmptyState, PageHeader)
- [ ] Establish spacing & typography scale tokens
- [ ] Loading/error components for list/detail states
- [ ] Toast + dialog service wrappers for API success/failure

## 8. Backend Feature Alignment (UI hooks needed)

- Bid flow UI ↔ Bid module (place bid, anti-snipe timers, extends end time)
- Cart + checkout UI ↔ Cart & Transaction modules (locks, penalties, payments)
- Wishlist/Follow/Like UI ↔ respective modules with notification/log side-effects
- Notification center ↔ Notification module (read, read-all, push indicators)
- Chat UI ↔ Chat HTTP + WebSocket contract (message list, composer)
- Admin tools ↔ Admin module (ban/unban, approve auctions, withdrawals)
- Seller analytics ↔ SellerBalance + RevenueSummary modules
- Profile/settings ↔ User module (PATCH /user/me, addresses, password reset)
- Media manager ↔ Media upload endpoints (presigned URLs per TODO.backend §16b)
- System banners ↔ Advertisement module placements

## 9. Testing & Tooling Hooks

- [ ] Storybook-style gallery for key components (optional)
- [ ] Visual regression or screenshot diff for dashboard layouts
- [ ] Wire React Query or SWR + MSW mocks for rapid API integration testing

# End of tracker
