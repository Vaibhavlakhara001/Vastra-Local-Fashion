# VASTRA – Local Fashion Marketplace
> **"Har Local Dukaan, Ab Online."**

A complete, modern, responsive local clothing marketplace connecting neighborhood boutiques, heritage saree emporiums, garment stores, and master karigars with customers in their city.

Customers can discover all local clothing shops, explore their racks and complete collections, compare products and prices, order clothes online for same-day delivery, or reserve pieces for physical in-store trial and purchase offline.

---

## 🌟 Key Features

### 1. Brand Identity & Aesthetic
- **Indian Fashion Elegance**: Warm neutral backgrounds (`#FAF7F2`, cream), rich charcoal black, terracotta (`#C2410C`), and royal maroon accents.
- **Typography**: Luxury headings in *Playfair Display* serif paired with clean modern *Plus Jakarta Sans*.
- **Direct Local Commerce**: Clear physical shop provenance, address, distance, and in-store rack information on every product.

### 2. Multi-Mode Shopping (Online & Offline Discovery)
- **Online City Delivery**: Order clothes online with **Same-Day Local Delivery (within 4 hours)** or standard city delivery.
- **Offline Store Visit ("Try & Buy Offline")**:
  - One-click **"Visit Store"** directions, store opening hours, contact number, and landmark.
  - Direct **WhatsApp chat** with the shopkeeper to check real-time availability.
  - **"Reserve for Store Pickup"**: Customer selects product, size, and pickup time window. A unique **Pickup Reservation Code** (e.g. `RES-4482`) is generated. The piece is physically kept aside at the shop counter for 24 hours with zero advance payment!

### 3. Dedicated Local Clothing Shops Directory
- Explore local shops with filters for **City, Neighborhood / Area, Category, Distance slider, Rating, and Delivery/Pickup options**.
- **3 View Modes**:
  - **Grid View**: Store cards with cover photo, rating, verified badge, amenities, and collection preview.
  - **List View**: Detailed horizontal overview with address, phone, and specialties.
  - **Interactive City Map View**: Graphical city map with clickable boutique pins, distance indicators, and live store popup cards.

### 4. Individual Shop Pages
- Unique digital storefront for each shop:
  - *Sharma Clothing Store* (Heritage Banarasi Silks & Bridal Lehengas - Johari Bazar)
  - *Royal Fashion Boutique* (Lucknowi Chikankari & Indo-Western - C-Scheme)
  - *City Garments & Menswear* (Royal Bandhgalas & Sherwanis - MI Road)
  - *Ananya Handlooms & Sarees* (Kota Doria & Chanderi - Bapu Bazar)
  - *Trendy Wear Studio* (Artisanal Linen & Co-ords - Malviya Nagar)
  - *Little Stars Kids Apparel* (Organic Cotton Ethnic Wear - Raja Park)
- Complete catalog filtered strictly to that individual store.
- Physical address with Google Maps directions link and in-store amenities (Trial Rooms, Master Tailor on premises, AC, Valet Parking).
- Customer Reviews & Ratings specific to each store.

### 5. Product Details & Size Guide
- Multi-image gallery with zoom preview and available color swatches.
- Available sizes: XS, S, M, L, XL, XXL.
- **Interactive Size Guide Modal**: Indian measurement chart (Bust, Waist, Hips, Length in inches & cm).
- Fabric & craft specifications (Handwoven Katan Silk, Modal Silk, Pure Khadi, Zardozi).
- Badges: `Available for Same-Day Delivery` & `Available for In-Store Trial`.

### 6. Cart, Coupons & Checkout
- Multi-shop bag with shop attribution.
- Valid discount coupons:
  - `VASTRA100`: Flat ₹100 off
  - `LOCAL15`: 15% off on verified boutiques
  - `FESTIVE`: ₹250 off festive orders
- Multi-step checkout with delivery address and options (Standard, Express 4-Hour, Store Pickup).
- Payment methods: **Cash on Delivery (COD)**, **Demo UPI QR Simulator**, and **Demo Netbanking/Card**.

### 7. Live Order Tracking
- Real-time 5-step progress timeline:
  `Order Placed` ➔ `Confirmed by Shop` ➔ `Inspected & Packed` ➔ `Out for Delivery` ➔ `Delivered`
- Assigned local delivery rider name and shop contact.

### 8. Customer Account & Custom Profile (Zero Database Required)
- **Enter Your Own Details**: Any user can enter or update their **Own Full Name**, **Email Address**, **Mobile Phone**, and **City** via:
  1. The top header **"Shopping as: [Name]"** / User Avatar dropdown (**"Change Name / Address"**).
  2. The **My Details & Addresses** tab in the Customer Account page.
  3. Directly during **Checkout** with the option *"Save this name and address to my browser profile for future orders"*.
- **Full Address Book Management**:
  - Add multiple delivery addresses (Home, Office, Other).
  - Set default address, edit details, or delete addresses.
- **Client-Side Storage Persistence**:
  - All user profile changes, addresses, past orders, and in-store pickup reservations are safely preserved in the user's browser via HTML5 local storage.
  - Zero external database or cloud setup required—your data stays completely intact across browser refreshes and sessions!

### 9. Seller Registration & Dashboard
- **"Become a Seller" Page**: 3-step digital onboarding wizard for local retailers.
- **Seller Dashboard**:
  - Live metrics: Revenue, Orders count, Store Pickup holds, In-stock items.
  - **Product Management**: Add new garments (images, sizes, colors, fabric, pricing, stock levels) or delete items.
  - **Order Management**: Real-time order status updater (`Confirmed` ➔ `Packed` ➔ `Out for Delivery` ➔ `Delivered`).
  - **Store Pickup Reservations**: Mark holds as `Ready on Counter` or `Sold / Completed`.

### 10. Admin Dashboard
- Platform GMV, total registered shops, total garments, and order statistics.
- **Seller Verification**: Review pending seller applications with 1-click **"Approve & Verify Store"**.
- Manage store directory and toggle homepage featured status.

### 11. Instant Demo Role Switcher
- Convenient floating switcher at the bottom-right of every page:
  - 👤 **Customer** (`Priya Sharma`)
  - 🏪 **Seller** (`Ramesh Sharma` of *Sharma Clothing Store*)
  - 🛡️ **Admin** (*Vastra Operations*)

---

## 🚀 How to Run

### Method 1: Instant Browser Launch (Zero Installation)
Simply double-click or open `index.html` in your favorite web browser (Chrome, Edge, Firefox, Safari):
```text
C:\Users\lakha\.gemini\antigravity\scratch\vastra-local-fashion\index.html
```
No database setup or installation required! Everything runs out of the box with realistic seed data.

### Method 2: Node.js Local Server
Run with the included zero-dependency server:
```bash
npm start
```
Then open:
```text
http://localhost:3000
```
