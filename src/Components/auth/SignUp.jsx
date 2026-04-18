import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import Header from '../Header';
import SecondNav from '../SecondNav';
import toast from 'react-hot-toast';

function SignUp() {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(name, email, password);
            toast.success("Account created successfully!");
            navigate("/");
        } catch (error) {
            toast.error(error.message || "Registration failed");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="w-full z-50 bg-white shadow-sm">
                <Header />
                <SecondNav />
            </div>
            
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                    <h2 className="text-3xl font-black text-center text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Create Account</h2>
                    
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input 
                                type="text" 
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white outline-none"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white outline-none"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input 
                                type="password" 
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white outline-none"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </button>
                    </form>
                    
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <span onClick={() => navigate('/Login')} className="font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer hover:underline">
                            Log In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
