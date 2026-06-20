import React from 'react';
import { Link } from 'react-router-dom';
// Updated to .jpeg to match your new assets
import logoImg from '../../assets/logo.jpeg'; 

export default function Footer() {
  // Helper function to handle routing scroll behavior
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 py-12 text-slate-500 font-sans mt-auto text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logoImg} alt="Pradarsh Logo" className="h-10 w-10 rounded-xl object-cover shadow-sm border border-purple-900/5" />
              <span className="text-base font-black tracking-tight text-slate-800">
                Pradarsh
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              <span className="font-semibold text-slate-700 block mb-1">Where Talent Meets Visibility</span>
              Showcase your projects and portfolios, build your developer identity, and connect with the builder community.
            </p>
          </div>

          {/* Quick Directory Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link 
                  to="/" 
                  onClick={handleScrollToTop}
                  className="text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                {/* Changed from /projects to /explore */}
                <Link 
                  to="/explore" 
                  onClick={handleScrollToTop}
                  className="text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link 
                  to="/publish" 
                  onClick={handleScrollToTop}
                  className="text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  Publish
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Stats */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-4">Platform Stats</h4>
            <div className="space-y-2 text-sm text-slate-650">
              <div className="flex items-center space-x-2 text-xs">
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                <span className="text-slate-700 font-bold font-mono">Pradarsh Core V2 Live</span>
              </div>
              <p className="text-xs text-slate-500">Built for builders to inspire and get discovered.</p>
            </div>
          </div>

        </div>

        {/* Lower copyright */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-3">
          <p>© {new Date().getFullYear()} Pradarsh. Built for builders.</p>
          <div className="flex items-center space-x-6 font-semibold">
            <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}