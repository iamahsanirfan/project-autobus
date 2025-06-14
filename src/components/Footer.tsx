export default function Footer() {
  return (
    <footer className="bg-[#4A102A] border-t border-[#85193C]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Karachi Bus Tracker</h3>
            <p className="text-gray-300">
              Real-time bus tracking and route planning for Karachi. Never miss your bus again!
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-[#FCF259] transition-colors">Home</a></li>
              <li><a href="/plan" className="text-gray-300 hover:text-[#FCF259] transition-colors">Plan Journey</a></li>
              <li><a href="#map" className="text-gray-300 hover:text-[#FCF259] transition-colors">Live Map</a></li>
              <li><a href="#routes" className="text-gray-300 hover:text-[#FCF259] transition-colors">Bus Routes</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@karachibustracker.com</li>
              <li>Phone: +92 300 1234567</li>
              <li>Address: Gulshan-e-Iqbal, Karachi</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#85193C] mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Karachi Bus Tracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}