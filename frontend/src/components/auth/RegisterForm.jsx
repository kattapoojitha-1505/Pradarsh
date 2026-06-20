import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmail, loginWithGoogle } from '../../services/firebase';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../common/Navbar';
import logo from '../../assets/logo.jpeg'; 

const RegisterForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      navigate('/dashboard'); // Safety jump
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      await registerWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative bg-white overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(rgba(139, 92, 246, 0.15) 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Background Ambient Glow to match Home Page */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-500/10 to-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Seamless Navbar Integration */}
      <Navbar />

      {/* Main Content Centered */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-white/50 p-8 sm:p-10">
          
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="Pradarsh Logo" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-5 object-cover ring-4 ring-white shadow-md" />
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Join Pradarsh</h2>
          </div>
          
          {error && <p className="text-red-500 mb-5 text-center text-sm font-semibold bg-red-50 p-2 rounded-lg">{error}</p>}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <input 
                type="email" 
                placeholder="Email address" 
                required 
                className="w-full p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-sm sm:text-base font-medium" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                required 
                className="w-full p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all pr-12 text-sm sm:text-base font-medium" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm Password" 
                required 
                className="w-full p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all pr-12 text-sm sm:text-base font-medium" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-base font-semibold shadow-md hover:bg-blue-700 transition-all mt-2">
              Create Account
            </button>
          </form>
          
          <div className="relative flex items-center justify-center my-8">
            <div className="absolute border-t border-gray-200 w-full"></div>
            <span className="bg-white/90 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider relative z-10 rounded-full">OR</span>
          </div>
          
          <button 
            onClick={handleGoogleLogin} 
            className="w-full bg-white border-2 border-gray-100 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-3 font-bold text-gray-700 shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm font-medium text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-violet-600 hover:text-violet-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterForm;