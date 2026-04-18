import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { ProductContext } from '../Context/ProductContext';

function Admin(){
    const navigate = useNavigate();
    const { products, deleteProduct } = useContext(ProductContext);
    const [showProducts, setShowProducts] = useState(false);
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/AdminLogin');
        }
    }, [navigate]);
    
    const handleDeleteProduct = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(productId);
        }
    };
    
    return(
        <div className="min-h-screen bg-gray-50">
            <div className="w-full mx-auto mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md hover:bg-gradient-to-l from-indigo-500 to-purple-500">
                <h1 className="flex items-center justify-center text-2xl font-bold p-2 hover:text-white hover:cursor-pointer">Welcome to Admin Page</h1>
            </div>
            
            <div className="flex items-center justify-center space-x-4 mt-8 p-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hover:cursor-pointer" onClick={() => navigate('/AddProduct')}>Add Product</button>
                <button 
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:cursor-pointer"
                    onClick={() => setShowProducts(!showProducts)}
                >
                    {showProducts ? 'Hide Products' : 'Manage Products'}
                </button>
            </div>
            
            {showProducts && (
                <div className="max-w-6xl mx-auto mt-8 p-4">
                    <h2 className="text-2xl font-bold mb-6 text-center">All Products ({products.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                                <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                                <p className="text-xl font-bold text-green-600 mb-2">Rs. {product.price}</p>
                                <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
                                <div className="flex space-x-2">
                                    <button 
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                                        onClick={() => navigate(`/AddProduct?edit=${product.id}`)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
export default Admin