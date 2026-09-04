import { Link } from 'react-router-dom';
import { Video, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center relative overflow-hidden bg-[#080a0f] text-[#eef0ff]">
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-indigo-600/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative animate-slide-up">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
          <Video size={28} className="text-white" />
        </div>
        <p className="text-7xl font-black mb-2 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          404
        </p>
        <h1 className="text-xl font-bold text-[#eef0ff] mb-2">Page not found</h1>
        <p className="text-sm text-[#8b8fa8] mb-8 max-w-sm">
          This meeting room doesn't exist or the link has expired.
        </p>
        <Link to="/dashboard">
          <Button size="lg" className="gap-2">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
