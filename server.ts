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
      // Extract chat username from link (e.g., https://t.me/channelname -> @channelname)
      let chatId = link.split("/").pop();
      if (!chatId.startsWith("@")) {
        chatId = "@" + chatId;
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
