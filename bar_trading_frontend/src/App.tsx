// src/App.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { SetupPage } from './pages/SetupPage';
import { LoginPage } from './pages/LoginPage';

// Definiamo il tipo User anche qui
type User = {
  id: number;
  username: string;
  role: string;
};

// Creiamo dei componenti placeholder per le dashboard
function ManagerDashboard({ user, onLogout }: { user: User, onLogout: () => void }) {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl">Dashboard Manager</h1>
      <p>Benvenuto, {user.username}!</p>
      <button onClick={onLogout} className="mt-4 bg-red-600 p-2 rounded">Logout</button>
    </div>
  )
}

function BaristaDashboard({ user, onLogout }: { user: User, onLogout: () => void }) {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl">Interfaccia Bancone</h1>
      <p>Barista: {user.username}</p>
      <button onClick={onLogout} className="mt-4 bg-red-600 p-2 rounded">Logout</button>
    </div>
  )
}


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSetupNeeded, setIsSetupNeeded] = useState(false);
  // Modifichiamo lo stato: ora memorizza l'oggetto user completo o null
  const [user, setUser] = useState<User | null>(null);

  // Questa funzione verrà chiamata al login e al caricamento della pagina se il token esiste
  const fetchUserFromToken = async (token: string) => {
    try {
      // Creeremo questo endpoint nel backend per validare un token e ottenere i dati dell'utente
      const response = await axios.get('http://localhost:3000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Token non valido o scaduto", error);
      localStorage.removeItem('authToken'); // Rimuovi il token non valido
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserFromToken(token); // Se troviamo un token, proviamo a validarlo
    }

    const checkSetupStatus = async () => {
      // ... la logica di checkSetupStatus rimane la stessa ...
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // --- Logica di Visualizzazione basata sul ruolo ---
  if (isLoading) {
    return <div>Caricamento...</div>;
  }
  
  if (user) { // Se l'utente è loggato
    if (user.role === 'manager') {
      return <ManagerDashboard user={user} onLogout={handleLogout} />;
    } else {
      return <BaristaDashboard user={user} onLogout={handleLogout} />;
    }
  }

  if (isSetupNeeded) {
    return <SetupPage />;
  }

  return <LoginPage onLogin={setUser} />;
}

export default App;