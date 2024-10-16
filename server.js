import express from "express";
import "express-async-error";
import morgan from "morgan";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
connection.connect((error) => {
  if (error) {
    console.log("database.error");
    return;
  }
  console.log("succcess");
});

app.get("/info", (req, res) => {
  res.status(200).json({ msg: "success!" });
});

const secretKey = process.env.SECRET_KEY;

app.post("/login", async (req, res) => {
  const jwtToken = jwt.sign({ userId: 25 }, secretKey, { expiresIn: "1h" });
  const { email, password } = req.body;

  // Controlla se l'utente esiste nel database
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        return res.status(500).json({ msg: "Errore nel database" });
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: "Utente non trovato" });
      }

      const user = results[0];

      // Confronta la password criptata
      const criptedPassword = await bcrypt.hash(password, 10);

      if (!criptedPassword) {
        return res.status(401).json({ msg: "Password errata" });
      }

      res.status(200).json({
        msg: "success",
        apiToken: jwtToken,
        user,
      });
    }
  );
});

app.post("/registrazione", async (req, res) => {
  const { username, email, phone, password } = req.body;

  // Verifica che tutti i campi siano forniti
  if (!username || !email || !phone || !password) {
    return res.status(400).json({ msg: "Tutti i campi sono obbligatori." });
  }

  // Controlla se l'email esiste già nel database
  connection.query(
    "SELECT * FROM users  WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        console.log("Errore nel database:", error);
        return res.status(500).json({ msg: "Errore nel database" });
      }

      if (results.length > 0) {
        return res.status(409).json({ msg: "Email già registrata." });
      }

      // Cifra la password
      bcrypt.hash(password, 10, (error, criptedPassword) => {
        if (error) {
          console.log("Errore durante la cifratura della password:", error);
          return res
            .status(500)
            .json({ msg: "Errore durante la registrazione" });
        }

        const query =
          "INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)";
        connection.query(
          query,
          [username, email, phone, criptedPassword],
          (error, results) => {
            if (error) {
              console.log("Errore durante la registrazione:", error); // Log dell'errore
              return res
                .status(500)
                .json({ msg: "Errore durante la registrazione" });
            }

            const userId = results.inserId;

            connection.query(
              "SELECT * FROM users  INNER JOIN roles ON users.role_id=roles.id  WHERE email = ?",
              [email],
              (error, results) => {
                if (error) {
                  console.log("Errore nel database:", error);
                  return res.status(500).json({ msg: "Errore nel database" });
                }

                const user = results[0];

                res.status(201).json({
                  msg: "Registrazione avvenuta con successo!",
                  user: user,
                });
              }
            );
          }
        );
      });
    }
  );
});

app.listen(port, () =>
  console.log(`Server in ascolto su http://localhost:${port}`)
);
