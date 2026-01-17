# DTS Inventory Control System

A high-performance, local-first inventory and production management system designed for factory environments. This application helps track raw materials, packaging accessories, product recipes, and customer orders with automatic stock deduction.

## 🚀 Key Features

- **Unified Dashboard**: Real-time overview of low-stock alerts (materials + accessories) and recent order history.
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

### 1. Materials (Yield-Based)
Materials are raw items (like steel sheets or rolls of wire). 
- **Yield Logic**: When adding a material to a product recipe, you define the **Yield** (e.g., "5 items per 1 unit"). 
- **Deduction**: If you order 10 products, the system will deduct `10 / 5 = 2` units of material from stock.

### 2. Accessories (Quantity-Based)
Accessories are items used for packaging or assembly (like shipping boxes or screws).
- **Requirement**: You define a fixed number needed per product (e.g., "1 box per 1 product").
- **Deduction**: If you order 10 products, the system deducts `10 * 1 = 10` accessories.

### 3. Products & Capacity
Each product can have its own "Bill of Materials" and "Packaging Requirement". The system checks both lists to determine your **Capacity** (the maximum number you can build right now). If you have enough steel for 100 units but only 5 boxes, the Capacity will show **5 units**.

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
