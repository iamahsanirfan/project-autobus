// src/components/DownloadSection.jsx
import { motion } from 'framer-motion';

export default function DownloadSection() {
  return (
    <section id="download" className="py-20 px-4 bg-[#4A102A]">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Download Our Mobile App
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl">
              Get real-time bus tracking, arrival predictions, and service alerts right in your pocket. Available on both iOS and Android devices.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white py-3 px-6 rounded-lg flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                  <path d="M17.05 11.05c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7zm-10.1 0c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7zm10.1-4.05c1.5 0 2.7-1.2 2.7-2.7s-1.2-2.7-2.7-2.7-2.7 1.2-2.7 2.7 1.2 2.7 2.7 2.7zm-10.1 0c1.5 0 2.7-1.2 2.7-2.7s-1.2-2.7-2.7-2.7-2.7 1.2-2.7 2.7 1.2 2.7 2.7 2.7z" fill="currentColor"/>
                </svg>
                App Store
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white py-3 px-6 rounded-lg flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                  <path d="M4 20h14v2H4c-1.1 0-2-.9-2-2V6h2v14zM20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 11.5h-1V15H9.5v-1.5h-3V9H8v3h1.5V9H11v3h1v1.5zm6 1.5h-3V9h1.5v3H19v1.5h-1.5v-1H16v3zm0-3h-1.5v1H16v-1z" fill="currentColor"/>
                </svg>
                Google Play
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FCF259] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#C5172E] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
              
              {/* Phone mockup */}
              <div className="relative w-64 h-96 bg-gray-900 rounded-[40px] border-8 border-gray-800 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800 flex items-center justify-center">
                  <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
                </div>
                
                <div className="pt-10 px-4 h-full overflow-y-auto">
                  <div className="bg-[#4A102A] rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-bold">Route 1</span>
                      <span className="text-[#FCF259]">4 min</span>
                    </div>
                    <div className="text-gray-300 text-sm">Next bus to Saddar</div>
                  </div>
                  
                  <div className="bg-[#4A102A] rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-bold">Route 2</span>
                      <span className="text-[#FCF259]">8 min</span>
                    </div>
                    <div className="text-gray-300 text-sm">Next bus to Korangi</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#C5172E] to-[#85193C] rounded-xl p-4 text-white text-center mb-4">
                    <div className="text-lg font-bold mb-1">Track Nearby Bus</div>
                    <div className="text-sm">Tap to see buses near you</div>
                  </div>
                  
                  <div className="bg-[#4A102A] rounded-xl p-4">
                    <div className="text-white font-bold mb-2">Service Updates</div>
                    <div className="text-gray-300 text-sm">
                      <div className="flex items-start mb-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-1 mr-2"></div>
                        <div>Route 3 is running on schedule</div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1 mr-2"></div>
                        <div>Minor delays on Route 1 due to traffic</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}