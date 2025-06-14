import { useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    // In a real app, you would authenticate here
    setError('');
    // Redirect to driver dashboard after login
    window.location.href = '/driver';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A102A] to-[#85193C]">
      <Head>
        <title>Login | Karachi Bus Tracker</title>
        <meta name="description" content="Driver login for Karachi Bus Tracker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      
      <main className="flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-[#4A102A] rounded-2xl shadow-xl overflow-hidden border border-[#FCF259]/20"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-[#C5172E] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Driver Login</h2>
              <p className="text-gray-300 mt-2">Access your bus tracking dashboard</p>
            </div>
            
            {error && (
              <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#85193C] border border-[#FCF259]/20 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FCF259]"
                  placeholder="driver@example.com"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#85193C] border border-[#FCF259]/20 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FCF259]"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-[#FCF259] focus:ring-[#FCF259] border-gray-600 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-gray-300 text-sm">
                    Remember me
                  </label>
                </div>
                
                <a href="#" className="text-sm text-[#FCF259] hover:underline">
                  Forgot password?
                </a>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#C5172E] hover:bg-[#b01529] text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Sign In
              </motion.button>
            </form>
          </div>
          
          <div className="bg-[#85193C] px-8 py-4 text-center">
            <p className="text-gray-300 text-sm">
              Not a driver? <a href="#" className="text-[#FCF259] hover:underline">Contact us for access</a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}