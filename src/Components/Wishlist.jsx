import React, { useContext } from 'react';
import Header from './Header';
import SecondNav from './SecondNav';
import { ProductContext } from '../Context/ProductContext';
import { AuthContext } from '../Context/AuthContext';
import ProductCard from './ProductCard';

function Wishlist() {
    const productCtx = useContext(ProductContext);
    const wishlistItems = productCtx?.wishlist || [];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="w-full z-50 bg-white">
                <Header />
                <SecondNav />
            </div>
            <div className="pt-32 px-8 pb-10 max-w-7xl mx-auto w-full flex-1">
                <div className="flex items-center gap-4 mb-8 border-b pb-4">
                    <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <h1 className="text-3xl font-black text-gray-900">Your Wishlist</h1>
                </div>
                
                {wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20">
                        <p className="text-xl font-bold text-gray-400">There's nothing in your wishlist yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {wishlistItems.map((product) => (
                            <div key={product.wishlistItemId} className="relative">
                                {/* We can reuse ProductCard here since wishlist contains full product data! */}
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wishlist;
