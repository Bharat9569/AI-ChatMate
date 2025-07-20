import fs from 'fs';
import Tesseract from 'tesseract.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getAIResponse } from '../services/openaiService.js';
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

// __dirname for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Destructure from default import
const { getDocument, GlobalWorkerOptions } = pdfjsLib;

// ✅ Set worker path
GlobalWorkerOptions.workerSrc = path.join(
  __dirname,
  '../node_modules/pdfjs-dist/legacy/build/pdf.worker.js'
);

async function extractTextFromPDF(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = getDocument({ data });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

export const handleFileUpload = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let extractedText = '';

    if (file.mimetype === 'application/pdf') {
      extractedText = await extractTextFromPDF(file.path);
    } else if (file.mimetype.startsWith('image/')) {
      const result = await Tesseract.recognize(file.path, 'eng', {
        logger: m => console.log(m),
      });
      extractedText = result.data.text;
    } else {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ message: 'No readable text found in the file' });
    }

    const aiResponse = await getAIResponse(extractedText);

    res.status(200).json({ extractedText, aiResponse });
  } catch (err) {
    console.error('File processing error:', err);
    res.status(500).json({ message: 'Server error while processing file' });
  }
};
