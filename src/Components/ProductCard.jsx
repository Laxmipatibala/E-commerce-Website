import React, { useContext } from 'react';
import { ProductContext } from '../Context/ProductContext';
import { AuthContext } from '../Context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
    const { addToCart, toggleWishlist, wishlist } = useContext(ProductContext);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const isWishlisted = wishlist.some(w => w.id === product.id);

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!token) {
            toast.error("Please login to add to cart");
            navigate("/Login");
            return;
        }
        try {
            await addToCart(product.id);
            toast.success(`${product.name} added to cart!`);
        } catch (err) {
            toast.error("Failed to add to cart");
        }
    };

    const handleToggleWishlist = async (e) => {
        e.stopPropagation();
        if (!token) {
            toast.error("Please login to use wishlist");
            navigate("/Login");
            return;
        }
        try {
            await toggleWishlist(product.id);
            toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
        } catch (err) {
            toast.error("Wishlist update failed");
        }
    };

    return (
        <div 
            onClick={() => navigate(`/product/${product.id}`)}
            className="relative border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group bg-white/70 backdrop-blur-md cursor-pointer"
        >
            
            {/* Wishlist Button Overlay */}
            <button 
                onClick={handleToggleWishlist}
                className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
            >
                <svg className={`w-5 h-5 ${isWishlisted ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            <div className="h-56 w-full overflow-hidden bg-gray-50/50 p-4">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md" />
            </div>
            
            <div className="p-5 border-t border-gray-50/50">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">{product.category}</span>
                    <span className="text-lg font-black text-gray-900">${product.price?.toFixed(2) || product.price}</span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mb-4">{product.description}</p>
                
                <button 
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-gray-900 to-indigo-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2 group-hover:-translate-y-1"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
