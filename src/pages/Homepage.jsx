import Button from "@/components/atoms/Button";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-[#050505] selection:bg-blue-500/30 selection:text-blue-200">
      <main className="text-center py-6">
        <h6 className="text-white">Test Component</h6>
        <Button />
      </main>

      {/* Footer Sederhana (Opsional sebelum Anda buat filenya) */}
      <footer className="py-12 border-t border-white/5 bg-[#050505] text-center">
        <p className="text-gray-500 text-sm italic">
          Synthera ID &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
