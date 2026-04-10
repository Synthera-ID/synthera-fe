import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="py-20 border-t border-bg-3 bg-bg-1 relative z-10">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Kolom 1: Brand & Deskripsi */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-6">
              <Image src="/icon.png" alt="Synthera Logo" width={28} height={28} className="rounded-full" />
              <span className="text-[15px] font-bold text-text-1 tracking-wide">Synthera</span>
            </div>
            <p className="text-text-2 text-sm leading-relaxed">
              The ultimate subscription membership platform for modern businesses.
            </p>
          </div>

          {/* Kolom 2: Product */}
          <div>
            <h4 className="font-bold text-text-1 mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-text-2">
              <li><Link href="#pricing" className="hover:text-primary-3 transition-colors duration-300">Pricing</Link></li>
              <li><Link href="#features" className="hover:text-primary-3 transition-colors duration-300">Features</Link></li>
              <li><Link href="#faq" className="hover:text-primary-3 transition-colors duration-300">FAQ</Link></li>
              <li><Link href="#" className="hover:text-primary-3 transition-colors duration-300">Components</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Company */}
          <div>
            <h4 className="font-bold text-text-1 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-text-2">
              <li><Link href="#" className="hover:text-primary-3 transition-colors duration-300">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary-3 transition-colors duration-300">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary-3 transition-colors duration-300">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary-3 transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Kolom 4: Legal */}
          <div>
            <h4 className="font-bold text-text-1 mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-text-2">
              <li><Link href="#" className="hover:text-primary-3 transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary-3 transition-colors duration-300">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary-3 transition-colors duration-300">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bagian Bawah: Copyright */}
        <div className="pt-8 border-t border-bg-3 text-center text-text-3 text-xs">
          © 2026 Synthera. All rights reserved.
        </div>
      </div>
    </footer>
  );
}