// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database'; // <-- Importiamo la nostra connessione Knex

// Funzione per creare il primo utente Manager
export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // 1. Controlla se esiste già un manager usando Knex
        const existingManager = await db('users').where({ role: 'manager' }).first();
        if (existingManager) {
            return res.status(403).json({ message: 'Un account manager esiste già.' });
        }

        // 2. Cripta la password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 3. Inserisci il nuovo manager nel database usando Knex
        const [newUser] = await db('users')
            .insert({
                username,
                password_hash,
                role: 'manager',
            })
            .returning(['id', 'username', 'role']);

        res.status(201).json({ message: 'Account Manager creato con successo!', user: newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore interno del server." });
    }
};

export const login = async (req: Request, res: Response) => {
    console.log('--- Richiesta di login ricevuta ---');
    try {
        const { username, password } = req.body;
        console.log(`1. Dati ricevuti dal frontend: username='${username}', password='${password}'`);

        // Controlla se i dati sono arrivati
        if (!username || !password) {
            console.log('ERRORE: Username o password mancanti nella richiesta.');
            return res.status(400).json({ message: "Username e password sono obbligatori." });
        }

        // Cerca l'utente nel database
        const user = await db('users').where({ username }).first();

        if (!user) {
            console.log(`2. Risultato query: Utente '${username}' NON TROVATO nel database.`);
            return res.status(401).json({ message: 'Credenziali non valide.' });
        }

        console.log(`2. Risultato query: Trovato utente con ID ${user.id} e username '${user.username}'.`);
        console.log(`   - Hash salvato nel DB: ${user.password_hash}`);

        // Confronta la password fornita con quella salvata (hash)
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        console.log(`3. Risultato confronto password: ${isPasswordCorrect}`);

        if (!isPasswordCorrect) {
            console.log('ERRORE: Il confronto delle password ha fallito.');
            return res.status(401).json({ message: 'Credenziali non valide.' });
        }

        // Se tutto va bene, crea e invia il token
        console.log('4. Login riuscito. Generazione del token...');
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'una-chiave-segreta-di-default',
            { expiresIn: '8h' }
        );

        res.status(200).json({ token, user: { id: user.id, username: user.username, role: user.role } });
        console.log('--- Fine richiesta di login ---');

    } catch (error) {
        console.error("ERRORE GRAVE DURANTE IL LOGIN:", error);
        res.status(500).json({ message: 'Errore interno del server.' });
    }
};

// 3. AGGIUNGI LA FUNZIONE PER CONTROLLARE LO STATO
export const checkSetupStatus = async (_req: Request, res: Response) => {
    try {
        const manager = await db('users').where({ role: 'manager' }).first();
        res.status(200).json({ setupNeeded: !manager });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nel controllare lo stato del setup.' });
    }
};

// 4. AGGIUNGI LA FUNZIONE PER OTTENERE I DATI DELL'UTENTE LOGGATO
// Questa funzione verrà chiamata quando il client vuole sapere chi è l'utente logg
export const getMe = (req: Request, res: Response) => {
    // La funzione verifyToken ha già aggiunto l'utente alla richiesta
    // @ts-ignore
    res.json({ user: req.user });
};