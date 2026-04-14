import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyTelegramWebAppData = (req: Request, res: Response, next: NextFunction) => {
  const initData = req.headers['authorization']?.split(' ')[1] || req.body.initData;
  
  if (!initData) {
    return res.status(401).json({ error: 'Unauthorized: No initData provided' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.warn('Backend warning: TELEGRAM_BOT_TOKEN not configured. Bypassing auth temporarily for dev mode.');
    // In production, you would block this. For dev template compatibility, we pass.
    return next();
  }

  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (calculatedHash !== hash) {
      return res.status(403).json({ error: 'Forbidden: Invalid initData hash' });
    }

    const userJson = urlParams.get('user');
    if (userJson) {
      req.user = JSON.parse(decodeURIComponent(userJson));
    }
    
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden: Error parsing initData' });
  }
};
