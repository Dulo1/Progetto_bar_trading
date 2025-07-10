// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// 1. Definiamo un'interfaccia che descrive esattamente il contenuto del nostro token.
// Estende JwtPayload e aggiunge i nostri campi personalizzati.
export interface AuthPayload extends JwtPayload {
  id: number;
  username: string;
  role: string;
}

// 2. Aggiorniamo CustomRequest per usare la nostra nuova interfaccia.
export interface CustomRequest extends Request {
  user?: AuthPayload;
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  // Usiamo la nostra chiave segreta dal file .env
  const secret = process.env.JWT_SECRET || 'una-chiave-segreta-di-default';

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Forbidden (token non valido o scaduto)
    }
    // 3. Ora diciamo a TypeScript che il payload decodificato è del nostro tipo AuthPayload.
    req.user = decoded as AuthPayload;
    next();
  });
};


export const checkRole = (roles: Array<string>) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    // 4. Grazie al passaggio precedente, TypeScript ora sa che req.user ha la proprietà 'role'.
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accesso negato: privilegi insufficienti." });
    }
    next();
  };
};