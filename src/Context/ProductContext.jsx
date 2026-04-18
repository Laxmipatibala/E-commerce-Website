import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from './AuthContext';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const { token } = useContext(AuthContext) || {}; // We will handle null on startup

    // Fetch products
    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    // Fetch Cart & Wishlist if logged in
    const fetchUserItems = async () => {
        if (!token) {
            setCart([]);
            setWishlist([]);
            return;
        }
        try {
            const [cartRes, wishRes] = await Promise.all([
                api.get('/cart'),
                api.get('/wishlist')
            ]);
            setCart(cartRes.data);
            setWishlist(wishRes.data);
        } catch (err) {
            console.error("Failed to fetch user items", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (token) {
            fetchUserItems();
        } else {
            setCart([]);
            setWishlist([]);
        }
    }, [token]);

    const addProduct = async (productData) => {
        try {
            const res = await api.post('/products', productData);
            setProducts((prev) => [...prev, res.data]);
        } catch (err) {
            console.error("Add Product Error", err);
            throw err;
        }
    };

    const addToCart = async (productId) => {
        if (!token) throw new Error("Must be logged in to add to cart");
        try {
            await api.post('/cart', { productId });
            await fetchUserItems(); // Refresh to catch updated quantity or new row
        } catch (err) {
            throw err;
        }
    };

    const toggleWishlist = async (productId) => {
        if (!token) throw new Error("Must be logged in to use wishlist");
        try {
            const existing = wishlist.find(w => w.id === productId);
            if (existing) {
                await api.delete(`/wishlist/${productId}`);
            } else {
                await api.post('/wishlist', { productId });
            }
            await fetchUserItems();
        } catch (err) {
            throw err;
        }
    };

    const removeFromCart = async (cartItemId) => {
        if (!token) throw new Error("Must be logged in to modify cart");
        try {
            await api.delete(`/cart/${cartItemId}`);
            await fetchUserItems();
        } catch (err) {
            console.error("Remove from cart error", err);
            throw err;
        }
    };

    const checkout = async (totalAmount) => {
        if (!token) throw new Error("Must be logged in to checkout");
        try {
            const res = await api.post('/orders', { items: cart, totalAmount });
            // Clear local cart since it's cleared on backend
            setCart([]);
            return res.data;
        } catch (err) {
            console.error("Checkout error", err);
            throw err;
        }
    };

    return (
        <ProductContext.Provider value={{ 
            products, 
            addProduct, 
            cart, 
            addToCart, 
            removeFromCart,
            checkout,
            wishlist, 
            toggleWishlist 
        }}>
            {children}
        </ProductContext.Provider>
    );
}
