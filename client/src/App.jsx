import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// This component will conditionally render the navbar and footer
function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {!isLoginPage && <Navbar />}
      
      {/* Main Content */}
      <main className={`pb-16 flex-grow ${isLoginPage ? 'flex items-center justify-center' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <AppRouter />
        </div>
      </main>

      {/* Footer only on non-login/register pages */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;