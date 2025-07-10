// src/controllers/event.controller.ts
import { Response } from 'express';
import { CustomRequest } from '../middleware/auth.middleware';
import db from '../database';

type DrinkForEvent = {
    drink_id: number;
    base_price: number;
    initial_quantity: number;
};

export const createEvent = async (req: CustomRequest, res: Response) => {
    const { name, drinks } = req.body as { name: string; drinks: DrinkForEvent[] };

    if (!name || !drinks || !Array.isArray(drinks) || drinks.length === 0) {
        return res.status(400).json({ message: 'Nome evento e lista drink sono obbligatori.' });
    }

    // Usiamo una transazione per assicurare che tutte le operazioni vadano a buon fine o nessuna
    const trx = await db.transaction();
    try {
        // 1. Crea il nuovo evento nella tabella 'events'
        const [newEvent] = await trx('events').insert({ name, status: 'active' }).returning('*');

        // 2. Prepara i drink per questo evento
        const drinksToInsert = drinks.map(drink => ({
            event_id: newEvent.id,
            drink_id: drink.drink_id,
            base_price: drink.base_price,
            current_price: drink.base_price, // Il prezzo corrente all'inizio è quello base
            initial_quantity: drink.initial_quantity,
            current_quantity: drink.initial_quantity,
        }));

        // 3. Inserisci tutti i drink nella tabella 'event_drinks'
        await trx('event_drinks').insert(drinksToInsert);

        // Se tutto è andato bene, conferma la transazione
        await trx.commit();
        res.status(201).json({ message: 'Evento creato con successo!', event: newEvent });

    } catch (error) {
        // Se c'è un errore, annulla tutte le operazioni
        await trx.rollback();
        console.error(error);
        res.status(500).json({ message: 'Errore nella creazione dell\'evento.' });
    }
};