const express = require("express");
const app = express();

const port = 3000;

app.get("/", (req, res) => res.send("Welcome to my Server!"));

app.get('/about', (req, res) => {
    res.send('Questa è la pagina About');
  });

  app.get('/contact', (req, res) => {
    res.send('Questa è la pagina Contact');
  });


app.listen(port, () => console.log(`Server in ascolto su http://localhost:${port}`));
