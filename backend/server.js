import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

const app = express();
const PORT = 5001;
const JWT_SECRET = "super_secret_ecom_key_2026"; // Real prod would use dotenv

app.use(cors());
app.use(express.json());

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

    db.get("SELECT * FROM Users WHERE email = ?", [email], (err, row) => {
        if (row) return res.status(400).json({ error: "User already exists" });

        const hashed = bcrypt.hashSync(password, 10);
        db.run("INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, 'user')", [name, email, hashed], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            const token = jwt.sign({ id: this.lastID, email, name, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ token, user: { id: this.lastID, name, email, role: 'user' } });
        });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body; // email field holds username in admin case
    db.get("SELECT * FROM Users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: "User not found" });

        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user });
    });
});

// --- PRODUCT ROUTES ---

app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM Products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/products', authenticateToken, (req, res) => {
    const { name, price, description, category, image } = req.body;
    db.run("INSERT INTO Products (name, price, description, category, image) VALUES (?, ?, ?, ?, ?)", 
        [name, price, description, category, image], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name, price, description, category, image });
    });
});

// --- CART ROUTES ---
app.get('/api/cart', authenticateToken, (req, res) => {
    const query = `
        SELECT Carts.id as cartItemId, Products.*, Carts.quantity 
        FROM Carts 
        JOIN Products ON Carts.productId = Products.id 
        WHERE Carts.userId = ?
    `;
    db.all(query, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/cart', authenticateToken, (req, res) => {
    const { productId } = req.body;
    // Check if exists
    db.get("SELECT * FROM Carts WHERE userId = ? AND productId = ?", [req.user.id, productId], (err, row) => {
        if (row) {
            db.run("UPDATE Carts SET quantity = quantity + 1 WHERE id = ?", [row.id]);
            res.json({ message: "Quantity incremented" });
        } else {
            db.run("INSERT INTO Carts (userId, productId, quantity) VALUES (?, ?, 1)", [req.user.id, productId], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Added to cart", id: this.lastID });
            });
        }
    });
});

app.delete('/api/cart/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM Carts WHERE id = ? AND userId = ?", [req.params.id, req.user.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Removed from cart" });
    });
});

// --- WISHLIST ROUTES ---
app.get('/api/wishlist', authenticateToken, (req, res) => {
    const query = `
        SELECT Wishlists.id as wishlistItemId, Products.* 
        FROM Wishlists 
        JOIN Products ON Wishlists.productId = Products.id 
        WHERE Wishlists.userId = ?
    `;
    db.all(query, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/wishlist', authenticateToken, (req, res) => {
    const { productId } = req.body;
    db.get("SELECT * FROM Wishlists WHERE userId = ? AND productId = ?", [req.user.id, productId], (err, row) => {
        if (row) return res.status(400).json({ message: "Already in wishlist" });
        db.run("INSERT INTO Wishlists (userId, productId) VALUES (?, ?)", [req.user.id, productId], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Added to wishlist", id: this.lastID });
        });
    });
});

app.delete('/api/wishlist/:productId', authenticateToken, (req, res) => {
    db.run("DELETE FROM Wishlists WHERE productId = ? AND userId = ?", [req.params.productId, req.user.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Removed from wishlist" });
    });
});

// --- ORDER ROUTES ---
app.get('/api/orders', authenticateToken, (req, res) => {
    db.all("SELECT * FROM Orders WHERE userId = ? ORDER BY id DESC", [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/orders', authenticateToken, (req, res) => {
    const { items, totalAmount } = req.body;
    const date = new Date().toISOString();
    
    db.run("INSERT INTO Orders (userId, items, totalAmount, orderDate) VALUES (?, ?, ?, ?)",
        [req.user.id, JSON.stringify(items), totalAmount, date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // Clear cart after order
        db.run("DELETE FROM Carts WHERE userId = ?", [req.user.id], err => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Order placed successfully", orderId: this.lastID });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Backend server magically running on http://localhost:${PORT}`);
});
