// src/App.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Stato per sapere se stiamo ancora caricando i dati dal server
  const [isLoading, setIsLoading] = useState(true);
  
  // Stato per sapere se la configurazione iniziale è necessaria
  const [isSetupNeeded, setIsSetupNeeded] = useState(false);

  // useEffect viene eseguito una sola volta quando il componente appare
  useEffect(() => {
    // Funzione per controllare lo stato del setup
    const checkSetupStatus = async () => {
      try {
        // Chiamiamo il nostro backend all'endpoint che abbiamo creato
        const response = await axios.get('http://localhost:3000/api/setup/status');
        
        // Aggiorniamo lo stato in base alla risposta del server
        setIsSetupNeeded(response.data.setupNeeded);

      } catch (error) {
        // Se c'è un errore (es. il backend non risponde), lo mostriamo nella console
        console.error("Errore nel contattare il server:", error);
        alert("Impossibile connettersi al server. Assicurati che il backend sia in esecuzione.");
      } finally {
        // In ogni caso, abbiamo finito di caricare
        setIsLoading(false);
      }
    };

    checkSetupStatus();
  }, []); // Le parentesi quadre vuote significano: "esegui questo effetto solo una volta"

  // --- Logica di Visualizzazione ---

  // 1. Mostra un messaggio di caricamento mentre aspettiamo la risposta dal server
  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Caricamento...</h1>
      </div>
    );
  }

  // 2. Se il caricamento è finito, mostra la pagina giusta
  if (isSetupNeeded) {
    return <div>Pagina di Setup per il Manager</div>; // Creeremo questa pagina tra poco
  } else {
    return <div>Pagina di Login</div>; // E anche questa
  }
}

export default App;