import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { Input } from "../components/ui/input";

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Min 6 characters'),
});

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      setError(null);
      setSuccess(null);
      
      if (isRegistering) {
        await signUp(data.email, data.password);
        setSuccess('Account created. Please check your email.');
        // Don't reset the form on success so user can immediately login
      } else {
        await signIn(data.email, data.password);
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err?.message || (isRegistering ? 'Error creating account' : 'Invalid email or password');
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col" style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Top navigation */}
      <div className="absolute top-6 left-6">
        <div 
          className="text-[#8e8e8e] hover:text-[#262626] text-sm cursor-pointer transition-colors flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left panel - title only */}
        <div className="md:w-1/3 p-8 md:p-16 flex items-center md:items-end justify-center md:justify-start">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#8e8e8e] mb-2">Debt Manager</div>
            <h1 className="text-3xl md:text-4xl font-light text-[#262626] leading-tight">
              <span className="bg-gradient-to-r from-[#2563eb] to-[#16a34a] bg-clip-text text-transparent">
                {isRegistering ? 'create' : 'welcome'}
              </span>
              <span className="block font-normal mt-1 text-[#262626]">
                {isRegistering ? 'your account.' : 'back.'}
              </span>
            </h1>
          </div>
        </div>
        
        {/* Right panel - login form */}
        <div className="md:w-2/3 md:border-l border-[#efefef] p-8 md:p-16 flex items-start justify-center">
          <div className="w-full max-w-sm">
            {/* Error message */}
            {error && (
              <div className="mb-8 p-4 bg-[#ef4444]/10 rounded-xl text-[#ef4444] text-sm">
                {error}
              </div>
            )}
            
            {/* Success message */}
            {success && (
              <div className="mb-8 p-4 bg-[#16a34a]/10 rounded-xl text-[#16a34a] text-sm">
                {success}
              </div>
            )}
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wide text-[#8e8e8e] font-medium">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-white border-[#efefef] focus:border-[#2563eb] focus:ring-0 rounded-full h-12 shadow-none text-[#262626]"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-[#ef4444] text-xs mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wide text-[#8e8e8e] font-medium">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="• • • • • • • •"
                  className="bg-white border-[#efefef] focus:border-[#2563eb] focus:ring-0 rounded-full h-12 shadow-none text-[#262626]"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-[#ef4444] text-xs mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>
              
              <div className="pt-4 space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white h-12 rounded-full font-normal"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Processing..."
                    : isRegistering
                    ? "Create Account"
                    : "Sign In"
                  }
                </Button>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccess(null);
                      setIsRegistering(!isRegistering);
                      form.reset();
                    }}
                    className="text-[#2563eb] hover:text-[#1d4ed8] text-sm transition-colors"
                  >
                    {isRegistering
                      ? "Already have an account? Sign in"
                      : "Need an account? Create one"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bottom strip */}
      <div className="h-16 bg-white border-t border-[#efefef] flex items-center px-8">
        <div className="text-xs text-[#8e8e8e]">© {new Date().getFullYear()} Debt Manager</div>
      </div>
    </div>
  );
}