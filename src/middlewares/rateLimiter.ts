import rateLimit from 'express-rate-limit';

// Limite rigoroso para desenvolvimento: máximo de 50 requisições por IP a cada 15 minutos
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 50, 
    message: {
        error: 'Muitas requisições originadas deste IP. Limite de segurança atingido.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});