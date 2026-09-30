require('dotenv').config();
const mysql = require('mysql2/promise');

// 1. Khởi tạo Connection Pool sử dụng biến môi trường từ .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 2. Khởi tạo cấu trúc bảng và chèn dữ liệu mẫu
async function setupDatabaseAndSeedData() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      item_name VARCHAR(150) NOT NULL,
      price DECIMAL(12,2) NOT NULL,
      quantity INT DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );
  `);

  // Reset dữ liệu mẫu
  await pool.query('SET FOREIGN_KEY_CHECKS = 0;');
  await pool.query('TRUNCATE TABLE items;');
  await pool.query('TRUNCATE TABLE categories;');
  await pool.query('SET FOREIGN_KEY_CHECKS = 1;');

  await pool.query(`
    INSERT INTO categories (name, description) VALUES
    ('Food', 'Daily essentials and groceries'),
    ('Electronics', 'Gadgets, phones and computers'),
    ('Clothing', 'Apparel and fashion items'),
    ('Books', 'Educational and entertainment books'),
    ('Home & Living', 'Furniture and home appliances'),
    ('Sports & Outdoors', 'Sporting goods and outdoor equipment');
  `);

  await pool.query(`
    INSERT INTO items (category_id, item_name, price, quantity) VALUES
    (1, 'Apple', 25000.00, 100),
    (1, 'Milk', 32000.00, 50),
    (1, 'Bread', 15000.00, 30),
    (2, 'Smartphone', 5500000.00, 15),
    (2, 'Wireless Mouse', 250000.00, 40),
    (3, 'T-Shirt', 120000.00, 60),
    (3, 'Jeans', 350000.00, 25),
    (4, 'Node.js Programming', 180000.00, 20),
    (5, 'Desk Lamp', 150000.00, 35),
    (5, 'Coffee Mug', 45000.00, 80);
  `);
  console.log('-> Đã khởi tạo bảng và chèn dữ liệu mẫu thành công.');
}

async function main() {
  try {
    console.log('Đang kết nối tới MySQL...');
    await setupDatabaseAndSeedData();

    const [q1Rows] = await pool.execute(
      'SELECT * FROM items WHERE price >= ? AND quantity > ? ORDER BY price DESC',
      [500000, 0]
    );
    console.log('\n--- Question 1 Result ---');
    console.table(q1Rows);

    const [q2Rows] = await pool.execute(
      'SELECT * FROM items WHERE item_name LIKE ? OR item_name LIKE ?',
      ['%Gaming%', '%Wireless%']
    );
    console.log('\n--- Question 2 Result ---');
    console.table(q2Rows);

    const [q3Rows] = await pool.execute(`
      SELECT 
        COUNT(*) AS total_items, 
        SUM(quantity) AS total_quantity, 
        AVG(price) AS average_price 
      FROM items
    `);
    console.log('\n--- Question 3 Result ---');
    console.table(q3Rows);

    // Question 4: Thống kê theo danh mục, lọc tồn kho > 10,000,000 bằng HAVING
    const [q4Rows] = await pool.execute(`
      SELECT 
        c.id AS category_id,
        c.name AS category_name,
        COUNT(i.id) AS total_items,
        SUM(i.price * i.quantity) AS total_inventory_value
      FROM categories c
      INNER JOIN items i ON c.id = i.category_id
      GROUP BY c.id, c.name
      HAVING total_inventory_value > ?
    `, [10000000]);
    console.log('\n--- Question 4 Result ---');
    console.table(q4Rows);

  } catch (error) {
    console.error('Lỗi thực thi:', error.message);
  } finally {
    await pool.end();
    console.log('\n-> Đã đóng kết nối MySQL.');
  }
}

main();