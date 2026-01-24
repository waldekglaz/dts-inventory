const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

console.log('Running Feature Validation Tests...');

const dbPath = path.join(__dirname, '../inventory.db');
if (!fs.existsSync(dbPath)) {
    console.error('❌ Database not found at', dbPath);
    process.exit(1);
}

const db = new Database(dbPath);

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✅ ${message}`);
        testsPassed++;
    } else {
        console.error(`❌ ${message}`);
        testsFailed++;
    }
}

try {
    // 1. Check Customers Table
    const customersTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='customers'").get();
    assert(customersTable, 'Table "customers" exists');

    // 2. Check Customer Products Table
    const cpTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='customer_products'").get();
    assert(cpTable, 'Table "customer_products" exists');

    // 3. Check Order Columns
    const orderInfo = db.prepare("PRAGMA table_info(orders)").all();
    const hasOrderDate = orderInfo.some(c => c.name === 'order_date');
    const hasStartDate = orderInfo.some(c => c.name === 'start_date');
    const hasCompletionDate = orderInfo.some(c => c.name === 'completion_date');
    const hasCustomerId = orderInfo.some(c => c.name === 'customer_id');

    assert(hasOrderDate, 'Column "order_date" exists in orders');
    assert(hasStartDate, 'Column "start_date" exists in orders');
    assert(hasCompletionDate, 'Column "completion_date" exists in orders');
    assert(hasCustomerId, 'Column "customer_id" exists in orders');

    // 5. Check Material Columns
    const matInfo = db.prepare("PRAGMA table_info(materials)").all();
    const hasRemoteQty = matInfo.some(c => c.name === 'quantity_remote');
    const hasLeadTime = matInfo.some(c => c.name === 'lead_time_days');

    assert(hasRemoteQty, 'Column "quantity_remote" exists in materials');
    assert(hasLeadTime, 'Column "lead_time_days" exists in materials');

    // 6. Check Accessory Columns
    const accInfo = db.prepare("PRAGMA table_info(accessories)").all();
    const hasAccLeadTime = accInfo.some(c => c.name === 'lead_time_days');
    assert(hasAccLeadTime, 'Column "lead_time_days" exists in accessories');

    // 7. Integration Test: Create Customer and Link Product
    const testCustomerName = `Test Customer ${Date.now()}`;
    const insertCust = db.prepare("INSERT INTO customers (name) VALUES (?)").run(testCustomerName);
    const custId = insertCust.lastInsertRowid;
    assert(custId > 0, 'Created test customer');

    // Get a product
    const product = db.prepare("SELECT id FROM products LIMIT 1").get();
    if (product) {
        const insertLink = db.prepare("INSERT INTO customer_products (customer_id, product_id) VALUES (?, ?)").run(custId, product.id);
        assert(insertLink.changes === 1, 'Linked product to customer');

        // Verify link
        const link = db.prepare("SELECT * FROM customer_products WHERE customer_id = ? AND product_id = ?").get(custId, product.id);
        assert(link, 'Verified product link');
    } else {
        console.log('⚠️ No products found, skipping link test');
    }

    // McLean up - delete test customer (cascade should delete link)
    db.prepare("DELETE FROM customers WHERE id = ?").run(custId);
    const checkLink = db.prepare("SELECT * FROM customer_products WHERE customer_id = ?").get(custId);
    assert(!checkLink, 'Cascade delete worked (link removed after customer delete)');

} catch (err) {
    console.error('❌ Test crashed:', err);
    testsFailed++;
}

console.log(`\nTests Completed. Passed: ${testsPassed}, Failed: ${testsFailed}`);

if (testsFailed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
