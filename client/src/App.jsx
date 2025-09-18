// alasdairwood04/intramural-sport-app/Intramural-Sport-App-99e1da5415a846419501e81dab912798cc11b8c9/client/src/App.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <AppRouter />
        </main>
      </div>
    </Router>
  );
}

export default App;