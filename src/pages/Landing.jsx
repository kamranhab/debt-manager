import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 flex flex-col">
        {/* Top right corner login link */}
        <div className="absolute top-6 right-6">
          {user ? (
            <div 
              className="text-slate-400 hover:text-slate-900 text-sm cursor-pointer transition-colors"
              onClick={() => navigate('/dashboard')}
            >
              dashboard
            </div>
          ) : (
            <div 
              className="text-slate-400 hover:text-slate-900 text-sm cursor-pointer transition-colors"
              onClick={() => navigate('/login')}
            >
              login
            </div>
          )}
        </div>
        
        {/* Content with asymmetric layout */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Left panel - title only */}
          <div className="md:w-1/3 p-8 md:p-16 flex items-end">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-400 mb-2">Debt Manager</div>
              <h1 className="text-4xl md:text-5xl font-light text-slate-900 leading-tight">
                simplify
                <span className="block font-normal mt-1 text-slate-700">your debt.</span>
              </h1>
            </div>
          </div>
          
          {/* Right panel - content */}
          <div className="md:w-2/3 md:border-l border-slate-100 p-8 md:p-16 flex items-center">
            <div className="max-w-md">
              {/* Minimal debt indicator */}
              <div className="h-3 w-full bg-slate-100 rounded-full mb-24 overflow-hidden">
                <div className="h-full w-[65%] bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full"></div>
              </div>
              
              <div className="space-y-8">
                <p className="text-slate-500 text-lg">
                  Track progress. Build habits. <br/>Eliminate debt permanently.
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <Button
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2 rounded-full shadow-none"
                    onClick={() => navigate('/login')}
                  >
                    start
                  </Button>
                  
                  <div className="flex gap-8 text-sm text-slate-400">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-medium text-xl">$57K</span>
                      <span>avg. debt managed</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-medium text-xl">14mo</span>
                      <span>avg. time to freedom</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom strip */}
        <div className="h-16 bg-white border-t border-slate-100 flex items-center px-8">
          <div className="text-xs text-slate-400">© {new Date().getFullYear()} debt manager</div>
        </div>
      </main>
    </div>
  );
}