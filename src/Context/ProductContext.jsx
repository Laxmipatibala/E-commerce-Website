import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const { token } = useContext(AuthContext) || {};

    // Sample products data
    const sampleProducts = [
        {
            id: 1,
            name: "Wireless Headphones",
            price: 2999,
            description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
            category: "Electronics",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
        },
        {
            id: 2,
            name: "Smart Watch",
            price: 8999,
            description: "Fitness tracking smartwatch with heart rate monitor and GPS",
            category: "Electronics",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
        },
        {
            id: 3,
            name: "Designer T-Shirt",
            price: 599,
            description: "Premium cotton designer t-shirt with modern print",
            category: "Fashion",
            image: "https://images.unsplash.com/photo-1521572163474-681470826f95?w=300&h=300&fit=crop"
        },
        {
            id: 4,
            name: "Running Shoes",
            price: 2499,
            description: "Professional running shoes with advanced cushioning technology",
            category: "SportsAndFitness",
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop"
        },
        {
            id: 5,
            name: "Coffee Maker",
            price: 3999,
            description: "Automatic coffee maker with built-in grinder and milk frother",
            category: "HomeAndKitchen",
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop"
        },
        {
            id: 6,
            name: "Skincare Set",
            price: 1299,
            description: "Complete skincare set with cleanser, toner, and moisturizer",
            category: "BeautyAndHealth",
            image: "https://images.unsplash.com/photo-1556228720-195a624e8aa3?w=300&h=300&fit=crop"
        },
        {
            id: 7,
            name: "Programming Book",
            price: 499,
            description: "Learn programming with this comprehensive guide for beginners",
            category: "BooksAndHobbies",
            image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=300&fit=crop"
        },
        {
            id: 8,
            name: "Board Game",
            price: 799,
            description: "Strategic board game perfect for family game nights",
            category: "ToysAndGames",
            image: "https://images.unsplash.com/photo-1580477667995-44b1a3dfd9c6?w=300&h=300&fit=crop"
        }
    ];

    // Initialize products from localStorage or sample data
    useEffect(() => {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        } else {
            setProducts(sampleProducts);
            localStorage.setItem('products', JSON.stringify(sampleProducts));
        }
    }, []);

    // Initialize cart and wishlist from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && token) {
            const userId = user.id;
            const storedCart = localStorage.getItem(`cart_${userId}`);
            const storedWishlist = localStorage.getItem(`wishlist_${userId}`);
            
            setCart(storedCart ? JSON.parse(storedCart) : []);
            setWishlist(storedWishlist ? JSON.parse(storedWishlist) : []);
        } else {
            setCart([]);
            setWishlist([]);
        }
    }, [token]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && token) {
            const userId = user.id;
            localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
        }
    }, [cart, token]);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && token) {
            const userId = user.id;
            localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlist));
        }
    }, [wishlist, token]);

    const addProduct = async (productData) => {
        const newProduct = {
            ...productData,
            id: Date.now()
        };
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        return newProduct;
    };

    const deleteProduct = async (productId) => {
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
    };

    const addToCart = async (productId) => {
        if (!token) throw new Error("Must be logged in to add to cart");
        
        const product = products.find(p => p.id === productId);
        if (!product) throw new Error("Product not found");

        const existingItem = cart.find(item => item.id === productId);
        let updatedCart;
        
        if (existingItem) {
            updatedCart = cart.map(item =>
                item.id === productId
                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                    : item
            );
        } else {
            updatedCart = [...cart, { ...product, quantity: 1, cartItemId: Date.now() }];
        }
        
        setCart(updatedCart);
    };

    const removeFromCart = async (cartItemId) => {
        if (!token) throw new Error("Must be logged in to modify cart");
        
        const updatedCart = cart.filter(item => item.cartItemId !== cartItemId);
        setCart(updatedCart);
    };

    const toggleWishlist = async (productId) => {
        if (!token) throw new Error("Must be logged in to use wishlist");
        
        const existing = wishlist.find(w => w.id === productId);
        let updatedWishlist;
        
        if (existing) {
            updatedWishlist = wishlist.filter(w => w.id !== productId);
        } else {
            const product = products.find(p => p.id === productId);
            if (product) {
                updatedWishlist = [...wishlist, product];
            }
        }
        
        setWishlist(updatedWishlist);
    };

    const checkout = async (totalAmount) => {
        if (!token) throw new Error("Must be logged in to checkout");
        
        const user = JSON.parse(localStorage.getItem('user'));
        const order = {
            id: Date.now(),
            userId: user.id,
            items: cart,
            totalAmount,
            orderDate: new Date().toISOString()
        };
        
        // Save order to localStorage
        const existingOrders = localStorage.getItem(`orders_${user.id}`);
        const orders = existingOrders ? JSON.parse(existingOrders) : [];
        orders.push(order);
        localStorage.setItem(`orders_${user.id}`, JSON.stringify(orders));
        
        // Clear cart
        setCart([]);
        
        return order;
    };

    return (
        <ProductContext.Provider value={{ 
            products, 
            addProduct, 
            deleteProduct,
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
