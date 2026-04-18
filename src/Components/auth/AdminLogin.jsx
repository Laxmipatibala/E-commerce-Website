import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import Header from '../Header';
import SecondNav from '../SecondNav';
import toast from 'react-hot-toast';

function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Hardcoded admin credentials for immediate testing
            if (user === 'admin' && pwd === '1234') {
                const adminUser = {
                    id: 1,
                    name: 'Admin',
                    email: 'admin',
                    role: 'admin'
                };
                localStorage.setItem('user', JSON.stringify(adminUser));
                localStorage.setItem('token', 'admin_token_' + Date.now());
                toast.success("Admin Dashboard Unlocked!");
                navigate("/Admin");
                setLoading(false);
                return;
            }
            
            // Re-using login but verifying role. Our backend handles 'admin' as email logic.
            const res = await login(user, pwd); 
            
            // To ensure it's admin, they would have a specific role string, but since we 
            // set it manually in backend to role 'admin', AuthContext pulls user info.
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (currentUser?.role === 'admin') {
                toast.success("Admin Dashboard Unlocked!");
                navigate("/Admin");
            } else {
                toast.error("You do not have Admin privileges.");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Invalid Credentials");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 group">
            <div className="w-full z-50 bg-white shadow-sm">
                <Header />
                <SecondNav />
            </div>
            
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100 flex flex-col items-center justify-center transition-all duration-300 hover:border-indigo-500 hover:shadow-2xl hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-red-500 rounded-full flex items-center justify-center mb-6 shadow-md shadow-red-200">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Admin Access</h2>
                    
                    <form onSubmit={handleLogin} className="w-full space-y-4">
                        <input 
                            type="text" 
                            placeholder="Admin Username" 
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-gray-50 focus:bg-white transition-all"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        />
                        <input 
                            type="password" 
                            placeholder="Passcode" 
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-gray-50 focus:bg-white transition-all"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gray-900 text-white font-bold px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-300 disabled:opacity-75"
                        >
                            {loading ? "Verifying..." : "Secure Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default AdminLogin;