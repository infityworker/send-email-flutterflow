const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

app.use(
  cors({
    origin: "https://ensinamentofocoemsec.com.br",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Função para enviar e-mail
async function sendEmail(to, subject, text, from, authorization) {
  try {
    console.log("Enviando e-mail para:", to);

    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from,
        to,
        subject,
        text,
      },
      {
        headers: {
          Authorization: authorization,
        },
      }
    );

    console.log(
      "Resposta da API de envio de e-mail:",
      response.status,
      response.data
    );

    if (response.status === 200) {
      console.log("E-mail enviado com sucesso!");
      return "E-mail enviado com sucesso!";
    } else {
      console.log(
        "Erro ao enviar e-mail:",
        response.status,
        response.statusText
      );
      return `Erro ao enviar e-mail: ${response.status} ${response.statusText}`;
    }
  } catch (error) {
    console.error(
      "Erro ao enviar e-mail:",
      error.response ? error.response.data : error.message
    );
    return `Erro ao enviar e-mail: ${
      error.response ? error.response.data : error.message
    }`;
  }
}
// Endpoint para enviar e-mail
app.post("/send-email", async (req, res) => {
  const { to, subject, text, from } = req.body;
  const { authorization } = req.headers;

  if (!to || !subject || !text || !from || !authorization) {
    return res
      .status(400)
      .send(
        "Por favor, forneça 'to', 'subject', 'text', 'from' e 'authorization'."
      );
  }

  const result = await sendEmail(to, subject, text, from, authorization);
  res.send(result);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
