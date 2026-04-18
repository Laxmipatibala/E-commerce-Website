import React, { useContext } from 'react';
import Header from './Header';
import SecondNav from './SecondNav';
import { ProductContext } from '../Context/ProductContext';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosConfig';

function Cart() {
    const { token } = useContext(AuthContext) || {};
    const productCtx = useContext(ProductContext);
    const cartItems = productCtx?.cart || [];
    const navigate = useNavigate();

    const handleRemove = async (cartItemId) => {
        if (!token) return;
        try {
            await productCtx.removeFromCart(cartItemId);
            toast.success("Item removed");
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (!token) {
            toast.error("Please login to checkout");
            navigate("/Login");
            return;
        }
        if (cartItems.length === 0) return;
        try {
            await productCtx.checkout(total);
            toast.success("Order placed successfully!");
            navigate("/profile");
        } catch (err) {
            toast.error("Failed to place order");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="w-full z-50 bg-white">
                <Header />
                <SecondNav />
            </div>
            <div className="pt-32 px-8 pb-10 max-w-7xl mx-auto w-full flex-1">
                <h1 className="text-3xl font-black text-gray-900 mb-8 border-b pb-4">Your Shopping Cart</h1>
                
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20">
                        <span className="text-6xl mb-4">🛒</span>
                        <p className="text-xl font-bold text-gray-400">Your cart is empty.</p>
                        <button onClick={() => navigate('/')} className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-indigo-700">Start Shopping</button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="flex-1 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.cartItemId} className="flex bg-white p-4 rounded-2xl shadow-sm border border-gray-100 items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="h-24 w-24 bg-gray-50 rounded-xl overflow-hidden p-2">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                                            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">{item.category}</p>
                                            <p className="font-black text-indigo-600 mt-2">${item.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 min-w-[200px] justify-between">
                                        <div className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-gray-700">
                                            Qty: {item.quantity}
                                        </div>
                                        <button 
                                            onClick={() => handleRemove(item.cartItemId)}
                                            className="text-red-500 hover:text-red-700 font-bold p-2 bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Checkout Box */}
                        <div className="w-full lg:w-96 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-40">
                            <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>
                            <div className="space-y-3 text-gray-600 border-b pb-4 mb-4">
                                <div className="flex justify-between items-center">
                                    <span>Subtotal</span>
                                    <span className="font-bold">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Shipping</span>
                                    <span className="text-green-500 font-bold">Free</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-black text-indigo-600">${total.toFixed(2)}</span>
                            </div>
                            <button 
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0}
                                className="w-full bg-gradient-to-r from-gray-900 to-indigo-900 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
