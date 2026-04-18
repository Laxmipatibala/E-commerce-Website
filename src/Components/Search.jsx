import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import SecondNav from './SecondNav';
import ProductCard from './ProductCard';
import { ProductContext } from '../Context/ProductContext';

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { products } = useContext(ProductContext);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (query) {
            const lowercasedQuery = query.toLowerCase();
            const results = products.filter(product => 
                product.name.toLowerCase().includes(lowercasedQuery) ||
                product.description.toLowerCase().includes(lowercasedQuery) ||
                product.category.toLowerCase().includes(lowercasedQuery)
            );
            setFilteredProducts(results);
        } else {
            setFilteredProducts([]);
        }
    }, [query, products]);

    return (
        <div className="bg-gray-50 min-h-screen pb-20 font-sans text-gray-900">
            <div className="fixed top-0 left-0 w-full z-50">
                <Header />
                <SecondNav />
            </div>
            <main className="pt-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        Search Results for <span className="text-indigo-600">"{query}"</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">
                        Found {filteredProducts.length} product(s)
                    </p>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center mt-20 p-12 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <svg className="w-24 h-24 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No results found</h2>
                        <p className="text-gray-500 text-center max-w-md">
                            We couldn't find anything matching "{query}". Try adjusting your search or explore our categories.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Search;
