const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('./database.db');

function formatarJogo(jogo) {
  return {
    id: jogo.id,
    nome: jogo.nome,
    tipo: jogo.tipo,
    nota: jogo.nota,
    review: jogo.review
  };
}

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "usuario@esoft.com" && password === "Abc123") {
    return res.status(200).json({
      token: "550e8400-e29b-41d4-a716-446655440000" // UUID fixo
    });
  }

  return res.status(401).json({
    mensagem: "Email ou senha inválidos"
  });
});

router.get("/jogos", (req, res) => {
  db.all("SELECT * FROM jogos", (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao buscar jogos", error: err });
    }
    res.status(200).json(rows.map(formatarJogo));
  });
});

// Rota para buscar jogo por ID
router.get("/jogos/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM jogos WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao buscar jogo", error: err });
    }
    if (!row) {
      return res.status(404).json({ message: "Jogo não encontrado" });
    }
    res.status(200).json(formatarJogo(row));
  });
});

router.post("/jogos", (req, res) => {
  const { nome, tipo, nota, review } = req.body;

  if (!nome || !tipo || !nota || !review) {
    return res.status(400).json({
      mensagem: "Todos os campos são obrigatórios."
    });
  }

  if (isNaN(nota)) {
    return res.status(400).json({ mensagem: "A nota deve ser um número válido." });
  }

  const query = "INSERT INTO jogos (nome, tipo, nota, review) VALUES (?, ?, ?, ?)";
  db.run(query, [nome, tipo, nota, review], function(err) {
    if (err) {
      return res.status(500).json({ message: "Erro ao adicionar jogo", error: err });
    }
    res.status(201).json({
      id: this.lastID,
      nome,
      tipo,
      nota,
      review
    });
  });
});

router.put("/jogos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, tipo, nota, review } = req.body;
  const query = "UPDATE jogos SET nome = ?, tipo = ?, nota = ?, review = ? WHERE id = ?";
  db.run(query, [nome, tipo, nota, review, id], function(err) {
    if (err) {
      return res.status(500).json({ message: "Erro ao atualizar jogo", error: err });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Jogo não encontrado" });
    }
    res.status(200).json({ id, nome, tipo, nota, review });
  });
});

router.delete("/jogos/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM jogos WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({ message: "Erro ao remover jogo", error: err });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Jogo não encontrado" });
    }
    res.status(204).send();
  });
});

module.exports = router;