// src/pages/SetupPage.tsx
import { useState } from 'react';
import axios from 'axios';

// Un piccolo componente per il pulsante, per mostrare lo stato di caricamento
const SubmitButton = ({ isLoading }: { isLoading: boolean }) => (
  <button
    type="submit"
    disabled={isLoading}
    className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
  >
    {isLoading ? 'Creazione in corso...' : 'Crea Account Manager'}
  </button>
);


export function SetupPage() {
  // Stati per memorizzare i valori degli input del form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Stati per gestire i messaggi di errore e il caricamento
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Funzione che viene eseguita quando il form viene inviato
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Impedisce il ricaricamento della pagina
    setError(''); // Pulisce errori precedenti

    // 1. Validazione dei dati
    if (!username || !password) {
      setError('Username e password sono obbligatori.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Chiamata all'API del backend
      await axios.post('http://localhost:3000/api/setup/create-admin', {
        username,
        password,
      });

      // 3. Successo!
      alert('Account Manager creato con successo! Verrai reindirizzato alla pagina di login.');
      window.location.reload(); // Il modo più semplice per forzare un re-check dello stato di setup

    } catch (err: unknown) { // <-- Usa 'unknown' invece di 'any'
  // Controlliamo che l'errore sia di tipo Axios e abbia una risposta
  if (axios.isAxiosError(err) && err.response) {
    setError(err.response.data.message || 'Errore sconosciuto dal server.');
  } else {
    setError('Si è verificato un errore di connessione o imprevisto.');
  }
} finally {
  setIsLoading(false);
}
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">Configurazione Iniziale</h1>
        <p className="text-gray-400 mb-6 text-center">Crea il tuo account Amministratore per iniziare.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="confirm-password">
              Conferma Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          {error && <p className="bg-red-500 text-white text-xs italic p-3 rounded mb-4">{error}</p>}

          <div className="flex items-center justify-between">
            <SubmitButton isLoading={isLoading} />
          </div>
        </form>
      </div>
    </div>
  );
}