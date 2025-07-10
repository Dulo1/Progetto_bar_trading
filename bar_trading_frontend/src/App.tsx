// src/App.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { SetupPage } from './pages/SetupPage';
import { LoginPage } from './pages/LoginPage';

// Un semplice componente per la dashboard
function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.reload();
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-green-400">Login Effettuato!</h1>
        <p className="mt-4">Benvenuto nella Dashboard.</p>
        <button 
          onClick={handleLogout}
          className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSetupNeeded, setIsSetupNeeded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Nuovo stato

  useEffect(() => {
    // Controlla se c'è un token nel localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
    
    // Funzione per controllare lo stato del setup
    const checkSetupStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/setup/status');
        setIsSetupNeeded(response.data.setupNeeded);
      } catch (error) {
        console.error("Errore nel contattare il server:", error);
        alert("Impossibile connettersi al server. Assicurati che il backend sia in esecuzione.");
      } finally {
        setIsLoading(false);
      }
    };

    checkSetupStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Caricamento...</h1>
      </div>
    );
  }

  // --- Nuova logica di visualizzazione ---
  if (isAuthenticated) {
    return <Dashboard />;
  }
  
  if (isSetupNeeded) {
    return <SetupPage />;
  }

  return <LoginPage />;
}

export default App;