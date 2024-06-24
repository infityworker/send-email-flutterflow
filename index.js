const express = require("express");
const axios = require("axios");

const app = express();
const PORT = "ensinamentofocoemsec.com.br";

app.use(express.json());

// Função para enviar e-mail
async function sendEmail(to, subject, text, from, authorization ) {
  try {
    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: from, // Adicione o endereço de e-mail do remetente
        to: to,
        subject: subject,
        text: text,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization, // Substitua 'YOUR_API_KEY' pelo seu token da API do Resend
        },
      }
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
    return `Erro ao enviar e-mail: ${error.response ? error.response.data : error.message}`;
  }
}

// Endpoint para enviar e-mail
app.post("/send-email", async (req, res) => {
  const { to, subject, text, from, authorization } = req.body;

  if (!to || !subject || !text || !from || !authorization) {
    return res.status(400).send("Por favor, forneça 'to', 'subject', 'text', 'from' e 'authorization'.");
  }

  const result = await sendEmail(to, subject, text, from, authorization);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em ${PORT}`);
});