import { Request, Response } from 'express';
import { adminDb } from '../firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';

export const verifyTelegramChat = async (req: Request, res: Response) => {
  const { userId, link } = req.body;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return res.status(500).json({ error: "TELEGRAM_BOT_TOKEN not configured" });
  }

  if (!userId || !link) {
    return res.status(400).json({ error: "userId and link are required" });
  }

  try {
    let chatId = '';
    try {
      const url = new URL(link);
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        chatId = pathParts[0];
      }
    } catch (e) {
      chatId = link;
    }

    if (chatId.startsWith('+')) {
      return res.json({ ok: false, error: "Invite links (+...) are not supported for verification. Please use the channel @username or numeric ID." });
    }

    if (!chatId.startsWith('@') && !chatId.startsWith('-') && isNaN(Number(chatId))) {
      chatId = '@' + chatId;
    }

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${chatId}&user_id=${userId}`
    );
    const data = await response.json();

    if (data.ok) {
      const status = data.result.status;
      const isMember = ["member", "administrator", "creator"].includes(status);
      res.json({ ok: true, isMember });
    } else {
      console.error("Telegram API Error:", data);
      res.json({ ok: false, error: data.description });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const completeTask = async (req: Request, res: Response) => {
  const { taskId, firebaseUid, duckReward = 50000, tonReward = 0 } = req.body;
  const user = req.user; // Decoded Telegram user
  
  if (!user && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Unauthorized: Invalid Telegram Auth' });
  }

  if (!firebaseUid) {
    return res.status(400).json({ error: 'Missing firebaseUid in payload' });
  }

  try {
    const userRef = adminDb.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    const userData = userSnap.data();
    
    // Security verification: Did this Firebase User actually bind to the Telegram User making this request?
    // We enforce 1-to-1 mapping to prevent someone stealing another Firebase account's rewards.
    if (user && userData?.tgId) {
      if (userData.tgId !== user.id) {
        return res.status(403).json({ error: 'Identity Mismatch: Firebase User does not belong to this Telegram Identity.' });
      }
    }

    // Check if task already completed
    if (userData?.completedTasks?.includes(taskId)) {
       return res.status(400).json({ error: 'Task already completed' });
    }

    // Enforce logic (update via Admin SDK overrides the lockdown in firestore.rules)
    await userRef.update({
      completedTasks: FieldValue.arrayUnion(taskId),
      [`taskCompletionTimes.${taskId}`]: FieldValue.serverTimestamp(),
      balance: FieldValue.increment(Math.floor(parseFloat(duckReward.toString()))),
      tonBalance: FieldValue.increment(parseFloat(tonReward.toString()))
    });

    res.json({ ok: true, message: 'Reward granted securely via backend.' });
  } catch (err) {
    console.error('Task Backend Error:', err);
    res.status(500).json({ error: 'Internal Server Error during task resolution' });
  }
};
