import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Top footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Smart Yatra</h3>
            <p className="text-slate-400">
              Your smart companion for planning sustainable, festival-aware trips.
              We make travel planning easy, efficient, and enjoyable.
            </p>
            <div className="flex gap-3 mt-4 text-slate-400">
              {/* These icons need Font Awesome (see note below) */}
              <a href="#" aria-label="Facebook" className="hover:text-white">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-white">
                <i className="fab fa-twitter" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-white">
                <i className="fab fa-instagram" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Destinations</a></li>
              <li><a href="#" className="hover:text-white">Special Offers</a></li>
              <li><a href="#" className="hover:text-white">Travel Guides</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Booking Guide</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Info</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <i className="fas fa-map-marker-alt mr-2" />
                123 Travel Street, City, Country
              </li>
              <li>
                <i className="fas fa-phone mr-2" />
                +91-98765-43210
              </li>
              <li>
                <i className="fas fa-envelope mr-2" />
                support@smartyatra.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-8 border-t border-slate-700 pt-4 text-xs text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Smart Yatra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
