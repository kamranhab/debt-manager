import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col" style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <main className="flex-1 flex flex-col">
        {/* Top right corner login link */}
        <div className="absolute top-6 right-6">
          {user ? (
            <div 
              className="text-[#2563eb] hover:text-[#1d4ed8] text-sm cursor-pointer transition-colors font-medium"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </div>
          ) : (
            <div 
              className="text-[#2563eb] hover:text-[#1d4ed8] text-sm cursor-pointer transition-colors font-medium"
              onClick={() => navigate('/login')}
            >
              Login
            </div>
          )}
        </div>
        
        {/* Content with asymmetric layout */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Left panel - title only */}
          <div className="md:w-1/3 p-8 md:p-16 flex items-end">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#8e8e8e] mb-2">Debt Manager</div>
              <h1 className="text-4xl md:text-5xl font-light text-[#262626] leading-tight">
                <span className="bg-gradient-to-r from-[#2563eb] to-[#16a34a] bg-clip-text text-transparent">simplify</span>
                <span className="block font-normal mt-1 text-[#262626]">your debt.</span>
              </h1>
            </div>
          </div>
          
          {/* Right panel - content */}
          <div className="md:w-2/3 md:border-l border-[#efefef] p-8 md:p-16 flex items-center">
            <div className="max-w-md">
              {/* Minimal debt indicator */}
              <div className="h-3 w-full bg-[#efefef] rounded-full mb-24 overflow-hidden">
                <div className="h-full w-[65%] bg-gradient-to-r from-[#2563eb] to-[#16a34a] rounded-full"></div>
              </div>
              
              <div className="space-y-8">
                <p className="text-[#8e8e8e] text-lg">
                  Track progress. Build habits. <br/>Eliminate debt permanently.
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <Button
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-2 rounded-full shadow-none"
                    onClick={() => navigate('/login')}
                  >
                    Get Started
                  </Button>
                  
                  <div className="flex gap-8 text-sm text-[#8e8e8e]">
                    <div className="flex flex-col">
                      <span className="text-[#262626] font-medium text-xl">$57K</span>
                      <span>avg. debt managed</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#262626] font-medium text-xl">14mo</span>
                      <span>avg. time to freedom</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom strip */}
        <div className="h-16 bg-white border-t border-[#efefef] flex items-center px-8">
          <div className="text-xs text-[#8e8e8e]">© {new Date().getFullYear()} Debt Manager</div>
        </div>
      </main>
    </div>
  );
}