import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Dynamic TON Connect Manifest
  app.get("/tonconnect-manifest.json", (req, res) => {
    const host = req.get('host');
    const protocol = req.get('x-forwarded-proto') || req.protocol;
    const origin = `${protocol}://${host}`;
    
    res.json({
      url: origin,
      name: "Gift Phase V2",
      iconUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=GiftPhase"
    });
  });

  // Telegram Verification API
  app.post("/api/verify-telegram", async (req, res) => {
    const { userId, link } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return res.status(500).json({ error: "TELEGRAM_BOT_TOKEN not configured" });
    }

    if (!userId || !link) {
      return res.status(400).json({ error: "userId and link are required" });
    }

    try {
      // Extract chat username from link or use as is
      let chatId = '';
      try {
        const url = new URL(link);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          chatId = pathParts[0];
        }
      } catch (e) {
        // Not a URL, assume it's a username or ID
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
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
