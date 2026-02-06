export default function Footer() {
    return (
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 text-sm text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-medium text-slate-800">
            © 2026 CareTrio
          </span>
  
          <span className="text-slate-600">
            Built with <span className="text-red-500">❤️</span> for healthcare
          </span>
        </div>
      </footer>
    );
  }