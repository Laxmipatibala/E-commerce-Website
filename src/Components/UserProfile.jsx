import React, { useContext, useEffect, useState } from 'react';
import Header from './Header';
import SecondNav from './SecondNav';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const { user, token } = useContext(AuthContext) || {};
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/Login');
            return;
        }
        
        const fetchOrders = () => {
            try {
                const storedOrders = localStorage.getItem(`orders_${user.id}`);
                const userOrders = storedOrders ? JSON.parse(storedOrders) : [];
                setOrders(userOrders.reverse()); // Show latest orders first
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, navigate, user.id]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <div className="w-full z-50 bg-white">
                <Header />
                <SecondNav />
            </div>
            
            <main className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
                <h1 className="text-3xl font-black text-gray-900 mb-8">My Profile</h1>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-indigo-50 shadow-inner">
                        <span className="text-indigo-600 font-black text-3xl">{user.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-gray-500 font-medium">{user.email}</p>
                    </div>
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-6">Order History</h2>
                
                {loading ? (
                    <p className="text-gray-500">Loading your orders...</p>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <p className="text-xl font-bold text-gray-400 mb-4">You haven't placed any orders yet.</p>
                        <button onClick={() => navigate('/')} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors">Start Shopping</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => {
                            const items = JSON.parse(order.items || '[]');
                            const date = new Date(order.orderDate).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            });
                            
                            return (
                                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Order Placed</p>
                                            <p className="font-medium text-gray-900">{date}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total</p>
                                            <p className="font-black text-indigo-600">Rs. {order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                                            <p className="font-medium text-gray-900">#{order.id}</p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 mb-4 last:mb-0 border-b last:border-0 pb-4 last:pb-0 border-gray-50">
                                                <div className="w-16 h-16 bg-gray-50 rounded-lg p-2 flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                                    <p className="text-sm text-gray-500">{item.category}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">Rs. {item.price}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default UserProfile;
