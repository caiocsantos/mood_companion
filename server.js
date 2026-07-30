import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY não está definida. Defina no arquivo .env.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.post('/api/classify', async (req, res) => {
  try {
    const { messagesBatch } = req.body;
    if (!Array.isArray(messagesBatch) || messagesBatch.length === 0) {
      return res.status(400).json({ error: 'messagesBatch inválido' });
    }

    const textBlock = messagesBatch.map(m => `- ${m}`).join('\n');
    const payload = {
      system_instruction: {
        parts: [
          { text: 'Você é um classificador emocional estrito. Receba um bloco de texto e retorne APENAS um JSON com o sentimento (-5 a 5) e a emoção dominante. Exemplo de resposta: {"score": 3, "emotion": "joy"}. Não adicione saudações ou textos explicativos.' }
        ]
      },
      contents: [
        {
          role: 'user',
          parts: [
            { text: textBlock }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 15,
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text || 'Erro Gemini' });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!rawText) {
      return res.status(502).json({ error: 'Resposta inválida do Gemini' });
    }

    const parsed = JSON.parse(rawText);
    return res.json({ score: parsed.score, emotion: parsed.emotion });
  } catch (err) {
    console.error('Erro /api/classify:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/respond', async (req, res) => {
  try {
    const { chatHistory, userMessage } = req.body;
    if (!Array.isArray(chatHistory) || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'Payload inválido' });
    }

    const payload = {
      system_instruction: {
        parts: [{ text: 'Você é o MoodCompanion, um companheiro emocional empático, atencioso e afetuoso dentro de um diário visual interativo. Responda em português do Brasil com 2 a 3 frases curtas. Não use linguagem clínica. Caso haja risco de vida, sugira ligar para o CVV 188.' }]
      },
      contents: chatHistory,
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
        topP: 0.9
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text || 'Erro Gemini' });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      return res.status(502).json({ error: 'Resposta inválida do Gemini' });
    }

    return res.json({ text });
  } catch (err) {
    console.error('Erro /api/respond:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend proxy rodando em http://localhost:${PORT}`);
});
