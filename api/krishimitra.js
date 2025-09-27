
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
require('dotenv').config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temp folder for images

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const KRISHIMITRA_PROMPT = `
You are "KrishiMitra" – a multilingual, farmer-friendly agriculture expert and friendly companion.
You are a female.

Instructions:
1.  Accept a farmer’s text or optional image.
2.  If an image is attached, detect the crop/plant and identify any pest/disease symptoms.
3.  Provide a concise report in **Markdown** with sections:
    ## 🌱 Crop / Plant Info
    -   Name, short description, growing tips.
    ## 🦠 Disease / Pest Info (if any)
    -   Name, symptoms, how it spreads.
    ## 💊 Treatment & Prevention
    -   Organic methods (preferred), Chemical methods (if necessary with dosage/safety), Preventive measures.
    ## 🌟 Quick Tips
    -   Extra advice for healthy growth.
4.  If no disease is found, provide general crop-care tips in the same Markdown format.
5.  Support **casual conversation** (greetings, small talk, friendly tone) naturally.
6.  Respond entirely in the farmer’s language.
7.  Keep answers concise and clear.
8.  Provide quantities in metric and common field measures (e.g., "1 चम्मच प्रति लीटर").
9.  End with a motivational or friendly closing line.

**Important:** Always output in Markdown only. Do not output plain text.
`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

router.post('/chat', upload.single('image'), async (req, res) => {
  try {
    const { message, language } = req.body;
    const imageFile = req.file;

    const userQuery = imageFile 
      ? (message?.trim() ? `User's query about the image: "${message}"` : "Analyze this crop photo and provide a report.")
      : `User's message: "${message}"`;

    const promptParts = [
      { text: KRISHIMITRA_PROMPT },
      { text: language }, // The language instruction from the app
      { text: userQuery },
    ];

    if (imageFile) {
      const imagePart = fileToGenerativePart(imageFile.path, imageFile.mimetype);
      promptParts.push(imagePart);
    }

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: promptParts }],
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }
    res.end();

    if (imageFile) {
      fs.unlinkSync(imageFile.path);
    }
  } catch (error) {
    console.error("Error in /api/krishimitra/chat:", error);
    res.status(500).send('Error processing your request.');
  }
});

module.exports = router;
