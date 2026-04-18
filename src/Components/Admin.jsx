import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Admin(){
    const navigate = useNavigate();
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/AdminLogin');
        }
    }, [navigate]);
    
    return(
        <div>
            <div className="w-full mx-auto mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md hover:bg-gradient-to-l from-indigo-500 to-purple-500">
                <h1 className="flex items-center justify-center text-2xl font-bold p-2 hover:text-white hover:cursor-pointer">Welcome to Admin Page</h1>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-16 p-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hover:cursor-pointer" onClick={() => navigate('/AddProduct')}>Add Product</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:cursor-pointer">Delete Product</button>
            </div>
        </div>
    )
}
export default Admin