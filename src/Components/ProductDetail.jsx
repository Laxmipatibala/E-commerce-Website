import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductContext } from '../Context/ProductContext';
import { AuthContext } from '../Context/AuthContext';
import Header from './Header';
import SecondNav from './SecondNav';
import toast from 'react-hot-toast';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, toggleWishlist, wishlist } = useContext(ProductContext);
    const { token } = useContext(AuthContext) || {};
    
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (products.length > 0) {
            const foundProduct = products.find(p => p.id === Number(id) || p.id === id);
            if (foundProduct) {
                setProduct(foundProduct);
            } else {
                toast.error("Product not found");
                navigate('/');
            }
        }
    }, [id, products, navigate]);

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <SecondNav />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl text-gray-500 font-bold">Loading product details...</p>
                </div>
            </div>
        );
    }

    const isWishlisted = wishlist.some(w => w.id === product.id);

    const handleAddToCart = async () => {
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

    const handleToggleWishlist = async () => {
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
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <div className="w-full z-50 bg-white">
                <Header />
                <SecondNav />
            </div>
            
            <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
                    
                    {/* Image Section */}
                    <div className="lg:w-1/2 p-8 lg:p-12 bg-gray-50/50 flex items-center justify-center relative">
                        {/* Wishlist Button Overlay */}
                        <button 
                            onClick={handleToggleWishlist}
                            className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
                        >
                            <svg className={`w-6 h-6 ${isWishlisted ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full max-h-[500px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" 
                        />
                    </div>

                    {/* Details Section */}
                    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                        <span className="text-sm font-black uppercase tracking-widest text-indigo-500 mb-2">{product.category}</span>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>
                        
                        <div className="text-3xl font-black text-gray-900 mb-8 border-b pb-6">
                            ${product.price?.toFixed(2) || product.price}
                        </div>
                        
                        <div className="mb-10">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Product Description</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 bg-gradient-to-r from-gray-900 to-indigo-900 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add to Cart
                            </button>
                            
                            <button 
                                onClick={() => navigate(-1)}
                                className="sm:w-32 bg-gray-100 text-gray-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProductDetail;
