import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new (sqlite3.verbose()).Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database: " + err.message);
    } else {
        console.log("Connected to the SQLite database. Setting up tables...");
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT,
                role TEXT DEFAULT 'user'
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS Products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                price REAL,
                description TEXT,
                category TEXT,
                image TEXT
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS Carts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                productId INTEGER,
                quantity INTEGER DEFAULT 1,
                FOREIGN KEY (userId) REFERENCES Users(id),
                FOREIGN KEY (productId) REFERENCES Products(id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS Wishlists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                productId INTEGER,
                FOREIGN KEY (userId) REFERENCES Users(id),
                FOREIGN KEY (productId) REFERENCES Products(id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS Orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                items TEXT,
                totalAmount REAL,
                orderDate TEXT,
                FOREIGN KEY (userId) REFERENCES Users(id)
            )`);

            // Inject default admin automatically so they can test immediately
            db.get(`SELECT * FROM Users WHERE role = 'admin'`, [], (err, row) => {
                if (!row) {
                    const hashed = bcrypt.hashSync('1234', 10);
                    // Standardizing to their previous 'admin'/'1234' combination logic
                    db.run(`INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)`, 
                           ['Admin', 'admin', hashed, 'admin']);
                    console.log("Default Admin injected. Username: 'admin', Password: '1234'");
                }
            });
        });
    }
});

export default db;
