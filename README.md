# DTS Inventory Control System

A high-performance, local-first inventory and production management system designed for factory environments. This application helps track raw materials, packaging accessories, product recipes, and customer orders with automatic stock deduction.

## 🚀 Key Features

- **Unified Dashboard**: Real-time overview of low-stock alerts, procurement lead times, and recent production activity.
- **Smart Reorder Planning**: Tracks lead times for all stock items and calculates estimated arrival dates to help procurement planning.
- **Split-Stock Management**: Track inventory across multiple locations (**In House** vs **Remote Warehouse**) for precise logistics control.
- **Customer Library**: Detailed customer contacts with per-customer authorized product lists (limiting what specific clients can order).
- **Production Yield Logic**: Unique material management where you define how many products can be made from a single unit of raw material.
- **Accessory & Packaging Tracking**: Manage discrete items like boxes, labels, and hardware required for fulfillment.
- **Production Capacity Analysis**: Automatically calculates how many units of a product can be built based on currently available stock.
- **Atomic Transactions**: Orders are processed safely—if any material is missing, the entire order is rolled back to prevent stock inconsistency.
- **Instant Search**: Debounced search bars across all modules for quick access to items.
- **Dark Mode UI**: Professional, high-contrast dashboard designed for production environments.

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: SQLite (local file-based storage)
- **Styling**: Vanilla CSS (Premium Dark Theme)
- **Icons**: Lucide React
- **ORM/Driver**: Better-SQLite3

## 📖 How it Works

### 1. Materials & Stock Management
Materials are raw inputs (steel, wire) managed with advanced tracking:
- **Split Location**: Record quantities separately for `In House` (factory floor) and `Remote` (warehouse) storage.
- **Lead Time**: Define how many days it takes for new stock to arrive.
- **Yield Logic**: Define recipes by "Yield" (e.g., "5 items per 1 sheet").
- **Deduction**: Ordering 10 products deducts `10 / 5 = 2` sheets from total stock.

### 2. Accessories
Discrete items (boxes, screws) needed for assembly/packaging:
- **Lead Time**: Track procurement delays for packaging just like raw materials.
- **Deduction**: 1-to-1 or 1-to-many relationships (e.g., "2 screws per unit").

### 3. Customers & Authorized Products
Manage your client base effectively:
- **Authorization**: Restrict specific customers to only order approved products.
- **Orders**: Place orders directly linked to customers, reducing data entry errors.

### 4. Products & Capacity
The system analyzes your Bill of Materials (Materials + Accessories) to determine **Capacity**: the maximum units you can build *right now*. If you have steel for 100 units but boxes for only 5, your capacity is **5 units**.

## 💻 Getting Started

### Installation
1. Clone the repository.
2. Run `npm install`.

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💾 Data & Backups

The application stores all data locally in a file named `inventory.db` in the root directory. 

**To backup your data:**
Simply copy the `inventory.db` file to a safe location (e.g., Google Drive, USB Drive). To restore, put the file back in the project root folder.

*Note: The `inventory.db` file is ignored by Git by default to protect your local inventory data.*
