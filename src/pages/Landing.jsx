import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-black">Debt Manager</div>
          <div className="space-x-4">
            {user ? (
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  className="bg-black hover:bg-black/90 text-white"
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Take Control of Your Debts
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Simplify your debt management with our powerful tracking and organization tools. Stay on top of what you owe and plan your path to financial freedom.
          </p>
          <Button
            size="lg"
            className="bg-black hover:bg-black/90 text-white px-8 py-6 text-lg"
            onClick={() => navigate('/login')}
          >
            Start Managing Your Debts
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Manage Your Debts
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track All Your Debts</h3>
              <p className="text-gray-600">Keep all your debts in one place with detailed information about creditors, amounts, and payment status.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Set Priorities</h3>
              <p className="text-gray-600">Organize your debts by priority level and stay focused on what needs to be paid first.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your debt payment progress and celebrate as you move closer to becoming debt-free.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their debts more effectively with our platform.
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg"
            onClick={() => navigate('/login')}
          >
            Create Your Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Debt Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}