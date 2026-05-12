const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const authRoutes = require("./database/controllers/AuthController");

const app = express();

// Criar e conectar ao banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Banco de dados SQLite conectado!');
  }
});

db.run(`CREATE TABLE IF NOT EXISTS jogos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  tipo TEXT,
  nota INTEGER,
  review TEXT
)`);

app.use(bodyParser.json());

app.use(authRoutes);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});