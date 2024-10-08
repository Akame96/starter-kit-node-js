const express = require("express");
const app = express();

const port = 3000;

app.get("/", (req, res) => res.send("Welcome to my Server!"));

app.get('/1', (req, res) => {
    res.send('Questa è la pagina numero 1');
  });

  app.get('/2', (req, res) => {
    res.send('Questa è la pagina numero 2');
  });


app.listen(port, () => console.log(`Server in ascolto su http://localhost:${port}`));
