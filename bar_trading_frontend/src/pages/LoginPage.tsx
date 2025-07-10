// src/pages/LoginPage.tsx
import { useState } from 'react';
import axios from 'axios';

// Nota: Creeremo un file per gestire lo stato di autenticazione in un secondo momento
// Per ora salviamo il token nel localStorage del browser.
const handleLoginSuccess = (token: string) => {
  localStorage.setItem('authToken', token);
  window.location.reload(); // Ricarica la pagina per mostrare l'interfaccia corretta
};

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        username,
        password,
      });

      // Se il login ha successo, salviamo il token
      handleLoginSuccess(response.data.token);

    } catch (err) {
      setError('Credenziali non valide. Riprova.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center">
      <div className="w-full max-w-xs bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">Login</h1>
        
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
          <div className="mb-6">
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
          
          {error && <p className="bg-red-500 text-white text-xs italic p-3 rounded mb-4">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
            >
              {isLoading ? 'Accesso...' : 'Entra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}