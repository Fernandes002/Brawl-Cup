import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "10mb" }));

  // File database path
  const DATA_FILE = path.join(process.cwd(), "tournaments.json");

  interface TournamentData {
    id: string;
    name: string;
    date: string;
    players: any[];
    rounds: any[];
    championId: string | null;
    isCompleted: boolean;
    stage: string;
    slotAssignments: Record<string, any>;
    adminCode: string;
    isArchived?: boolean;
  }

  // Load database from file
  function readTournaments(): Record<string, TournamentData> {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(data);
      }
    } catch (err) {
      console.error("Error reading tournaments from disk:", err);
    }
    return {};
  }

  // Save database to file
  function writeTournaments(data: Record<string, TournamentData>) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing tournaments to disk:", err);
    }
  }

  // Load initial data
  let tournamentsDb = readTournaments();

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get tournament state
  app.get("/api/tournaments/:id", (req, res) => {
    const { id } = req.params;
    const tour = tournamentsDb[id];
    if (!tour) {
      return res.status(404).json({ error: "Torneio não encontrado" });
    }
    
    // Deconstruct to omit adminCode from public eyes
    const { adminCode, ...publicData } = tour;
    res.json({ success: true, tournament: publicData });
  });

  // Create or update a tournament
  app.post("/api/tournaments", (req, res) => {
    const { 
      id, 
      name, 
      date, 
      players, 
      rounds, 
      championId, 
      isCompleted, 
      stage, 
      slotAssignments, 
      adminCode,
      isArchived
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do torneio é obrigatório" });
    }

    // Load fresh data in case multiple processes or restarts happened
    tournamentsDb = readTournaments();

    const existing = tournamentsDb[id];
    if (existing && existing.adminCode !== adminCode) {
      return res.status(403).json({ error: "Código de Administrador inválido para este torneio" });
    }

    tournamentsDb[id] = {
      id,
      name: name || "Brawl Cup",
      date: date || new Date().toLocaleDateString("pt-BR"),
      players: players || [],
      rounds: rounds || [],
      championId: championId || null,
      isCompleted: isCompleted || false,
      stage: stage || "setup",
      slotAssignments: slotAssignments || {},
      adminCode: adminCode || "brawl123",
      isArchived: isArchived || false
    };

    writeTournaments(tournamentsDb);
    res.json({ success: true, id });
  });

  // Archive a tournament when closed by operator
  app.post("/api/tournaments/:id/archive", (req, res) => {
    const { id } = req.params;
    const { adminCode } = req.body;

    tournamentsDb = readTournaments();
    const tour = tournamentsDb[id];
    if (!tour) {
      return res.status(404).json({ error: "Torneio não encontrado" });
    }

    if (tour.adminCode !== adminCode) {
      return res.status(403).json({ error: "Código de Administrador inválido" });
    }

    tour.isArchived = true;
    tournamentsDb[id] = tour;

    writeTournaments(tournamentsDb);
    res.json({ success: true });
  });

  // Verify if admin code is correct
  app.post("/api/tournaments/:id/verify", (req, res) => {
    const { id } = req.params;
    const { adminCode } = req.body;

    tournamentsDb = readTournaments();
    const tour = tournamentsDb[id];
    if (!tour) {
      return res.status(404).json({ error: "Torneio não encontrado" });
    }

    const isMatch = tour.adminCode === adminCode;
    res.json({ success: true, match: isMatch });
  });

  // Vite Integration
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
