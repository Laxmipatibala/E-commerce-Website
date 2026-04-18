import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { ProductContext } from '../Context/ProductContext';
import toast from 'react-hot-toast';

function Header() {
    const { token, logout, user } = useContext(AuthContext) || {};
    const { cart, wishlist } = useContext(ProductContext) || { cart: [], wishlist: [] };
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate('/');
    };

    return (
        <header className="w-full flex justify-between items-center px-6 lg:px-12 py-4 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            {/* Logo area */}
            <div
                className="text-2xl font-black tracking-tighter text-gray-900 cursor-pointer flex items-center gap-3 group"
                onClick={() => navigate('/')}
            >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-105">
                    <span className="text-white text-xl font-bold">E</span>
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">ShopEase</span>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-12 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for amazing products..."
                    className="w-full pl-12 pr-28 py-3 bg-gray-50/50 border border-gray-200 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all duration-300"
                />
                <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-gray-900 hover:bg-indigo-600 text-white rounded-full text-sm font-medium transition-colors shadow-sm cursor-pointer">
                    Search
                </button>
            </form>

            {/* Actions */}
            <div className="flex items-center space-x-6">

                {token ? (
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/profile')}>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border border-indigo-200 group-hover:border-indigo-400 transition-all shadow-sm group-hover:shadow-md">
                                <span className="text-indigo-700 font-bold text-sm">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                            </div>
                            <span className="hidden lg:block text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">
                                {user?.name || 'Profile'}
                            </span>
                        </div>
                        <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors cursor-pointer bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-3">
                        <button onClick={() => navigate('/AdminLogin')} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer px-2 border-r border-gray-300 pr-4">
                            Admin Login
                        </button>
                        <button onClick={() => navigate('/Login')} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer px-2 pl-2">
                            Log In
                        </button>
                        <button onClick={() => navigate('/SignUp')} className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
                            Sign Up
                        </button>
                    </div>
                )}

                <div className="flex items-center space-x-5 pl-6 border-l border-gray-200">
                    <button onClick={() => navigate('/Wishlist')} className="relative p-1.5 text-gray-500 hover:text-pink-500 transition-colors cursor-pointer group hover:scale-110 duration-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        <span className="absolute top-0 right-0 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">{wishlist.length}</span>
                    </button>
                    <button onClick={() => navigate('/Cart')} className="relative p-1.5 text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer group hover:scale-110 duration-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <span className="absolute top-0 right-0 w-4.5 h-4.5 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">{cart.length}</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;