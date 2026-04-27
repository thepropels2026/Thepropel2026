import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="text-2xl font-black font-montserrat mb-6">THE PROPELS</div>
          <p className="text-slate-500 max-w-sm mb-8">
            Building the next generation of global unicorns. Scale your vision with the world's most elite founder ecosystem.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Platform</h4>
          <ul className="space-y-4 text-slate-400">
            <li><Link href="/tools" className="hover:text-white transition-colors">Tools</Link></li>
            <li><Link href="/network" className="hover:text-white transition-colors">Network</Link></li>
            <li><Link href="/guide" className="hover:text-white transition-colors">Guide</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Company</h4>
          <ul className="space-y-4 text-slate-400">
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link href="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-500 text-sm">© 2024 The Propels. All rights reserved.</div>
        <div className="flex gap-8 text-slate-500 text-sm font-medium">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
