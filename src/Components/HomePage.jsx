import { useState, useEffect, useContext } from 'react';
import Header from './Header';
import SecondNav from './SecondNav';
import ProductCard from './ProductCard';
import { ProductContext } from '../Context/ProductContext';

function HomePage(){
    const { products } = useContext(ProductContext);
    const images=[
        "./src/Photos/slide1.jpg",
        "./src/Photos/slide2.jpg",
        "./src/Photos/slide3.jpg",
        "./src/Photos/slide4.jpg",
        "./src/Photos/slide5.jpg"
    ]
    const[slide,setSlide]=useState(0);
    useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % images.length);
    }, 3000);
        return()=>clearInterval(interval);
    },[]);
    return(
        <div className="bg-gray-50 min-h-screen pb-20 font-sans text-gray-900 overflow-hidden">
            <div className="fixed top-0 left-0 w-full z-50">
                <Header/>
                <SecondNav/>
            </div>
            
            <main className="pt-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Hero Title Section */}
                <div className="text-center mb-12 space-y-4 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">ShopEase</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Discover the extraordinary. Shop the latest trends with exclusive deals and premium quality products.
                    </p>
                </div>

                {/* Slider Component */}
                <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-[2rem] shadow-2xl relative group mb-20 bg-gray-100 border border-gray-200">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-900/40 to-transparent z-10 pointer-events-none"></div>
                    
                    <div
                      className="flex transition-transform duration-1000 ease-in-out h-[300px] md:h-[500px]"
                      style={{
                        transform: `translateX(-${slide * 100}%)`,
                      }}
                    >
                      {images.map((img, index) => (
                        <div key={index} className="w-full h-full flex-shrink-0 relative">
                            <img
                              src={img}
                              alt={`Slide ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                        </div>
                      ))}
                    </div>
                </div>

                {/* Suggested Section */}
                <div className="mt-16">
                    <div className="flex items-end justify-between mb-8 px-2 border-b border-gray-200 pb-4">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-gray-900">Suggested For You</h2>
                            <p className="text-gray-500 mt-2">Curated products we think you'll love</p>
                        </div>
                        <button className="hidden sm:inline-flex text-indigo-600 font-bold hover:text-indigo-700 transition items-center gap-1 cursor-pointer">
                            View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
export default HomePage