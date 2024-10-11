import express from "express";
import "express-async-error";
import morgan from "morgan";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from 'mysql'

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.get("/info", (req, res) => {
  res.status(200).json({ msg: "success!" });
});

app.post("/login", async (req, res) => {
  const token = "keycode";
  const { email, password } = req.body;
  const criptedPassword = await bcrypt.hash(password, 10);
  
  res.status(200).json({
    msg: "success",
    apiToken: token,
    email: email,
    password: criptedPassword,
  });
});

app.post("/registrazione", async (req, res) => {
  const token = "keycode";
  const { username, email, phone, password } = req.body;
  const criptedPassword = await bcrypt.hash(password, 10);

  res.status(200).json({
    msg: "success!",
    apiToken: token,
    username: username,
    email: email,
    phone: phone,
    password: criptedPassword,
  });
});

app.listen(port, () =>
  console.log(`Server in ascolto su http://localhost:${port}`)
);
