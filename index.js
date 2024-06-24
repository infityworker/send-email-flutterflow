const express = require("express");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const PORT = "ensinamentofocoemsec.com.br";

app.use(express.json());

// Função para enviar e-mail
async function sendEmail(to, subject, text, from, authorization) {
  try {
    console.log("Enviando e-mail para:", to);
    
    const formData = new FormData();
    formData.append('from', from);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('text', text);

    const response = await axios.post(
      "https://api.resend.com/emails",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: authorization,
        },
      }
    );

    console.log("Resposta da API de envio de e-mail:", response.status, response.data);

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
  const { to, subject, text, from, authorization } = req.header;

  if (!to || !subject || !text || !from || !authorization) {
    return res.status(400).send("Por favor, forneça 'to', 'subject', 'text', 'from' e 'authorization'.");
  }

  const result = await sendEmail(to, subject, text, from, authorization);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em ${PORT}`);
});