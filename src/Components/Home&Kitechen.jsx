import React, { useContext } from 'react';
import Header from './Header';
import SecondNav from './SecondNav';
import { ProductContext } from '../Context/ProductContext';
import ProductCard from './ProductCard';

function HomeAndKitchen() {
    const { products } = useContext(ProductContext);
    const categoryProducts = products.filter(p => p.category === "HomeAndKitchen");

    return (
        <div>
            <div className="fixed top-0 left-0 w-full z-50 bg-white">
                <Header />
                <SecondNav />
            </div>
            <div className="pt-40 px-8 pb-10 min-h-screen bg-gray-50">
                <div className='flex items-center justify-center max-w-4xl mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-12 shadow-lg shadow-indigo-200'>
                    <h1 className='text-3xl font-black p-5 text-white'>
                        Home & Kitchen Collection
                    </h1>
                </div>
                
                {categoryProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20">
                        <span className="text-6xl mb-4">🍳</span>
                        <p className="text-xl font-bold text-gray-400">No home & kitchen items found yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-[1400px] mx-auto">
                        {categoryProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
export default HomeAndKitchen;
