// src/pages/ManagerDashboard.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';

// Definiamo i tipi per i nostri oggetti
type Drink = {
  id: number;
  name: string;
  default_price: string; // Il database restituisce i decimali come stringhe
};

type User = {
  id: number;
  username: string;
  role: string;
};

export function ManagerDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [newDrinkName, setNewDrinkName] = useState('');
  const [newDrinkPrice, setNewDrinkPrice] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Funzione per recuperare i drink dal backend
  const fetchDrinks = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return; // Non fare nulla se non c'è il token

    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3000/api/drinks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrinks(response.data);
    } catch (err) {
      setError('Impossibile caricare la libreria dei drink.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Carica i drink appena il componente viene visualizzato
  useEffect(() => {
    fetchDrinks();
  }, []);

  // Funzione per gestire l'aggiunta di un nuovo drink
  const handleAddDrink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('authToken');

    try {
      await axios.post(
        'http://localhost:3000/api/drinks',
        { name: newDrinkName, default_price: parseFloat(newDrinkPrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Pulisci i campi e ricarica la lista dei drink
      setNewDrinkName('');
      setNewDrinkPrice('');
      fetchDrinks();
    } catch (err) {
      setError('Errore nell\'aggiungere il drink. Assicurati che il nome non esista già.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Manager</h1>
          <p className="text-gray-400">Benvenuto, {user.username}!</p>
        </div>
        <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sezione per aggiungere un drink */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-500">Aggiungi Nuovo Drink</h2>
          <form onSubmit={handleAddDrink}>
            <div className="mb-4">
              <label htmlFor="drinkName" className="block mb-2 text-sm font-bold text-gray-300">Nome Drink</label>
              <input
                id="drinkName"
                type="text"
                value={newDrinkName}
                onChange={(e) => setNewDrinkName(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="drinkPrice" className="block mb-2 text-sm font-bold text-gray-300">Prezzo Base (€)</label>
              <input
                id="drinkPrice"
                type="number"
                step="0.10"
                min="0"
                value={newDrinkPrice}
                onChange={(e) => setNewDrinkPrice(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded transition-colors">
              Aggiungi alla Libreria
            </button>
          </form>
        </div>

        {/* Sezione per visualizzare i drink esistenti */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-500">Libreria Drink</h2>
          {isLoading ? (
            <p>Caricamento drink...</p>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {drinks.map((drink) => (
                <li key={drink.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                  <span>{drink.name}</span>
                  <span className="font-mono">€{parseFloat(drink.default_price).toFixed(2)}</span>
                </li>
              ))}
              {drinks.length === 0 && <p className="text-gray-500 text-center py-4">La tua libreria è vuota. Aggiungi un drink per iniziare.</p>}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}