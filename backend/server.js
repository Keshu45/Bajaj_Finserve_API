import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static frontend files from 'frontend/dist' when in production or full-stack run
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// GET Request required by the assessment
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Main POST Request
app.post('/bfhl', (req, res) => {
  try {
    const { data, file_b64 } = req.body;
    
    let numbers = [];
    let alphabets = [];
    let highest_lowercase = [];
    let is_prime_found = false;

    // Validate data array
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (typeof item !== 'string' && typeof item !== 'number') return;
        
        const strItem = String(item).trim();
        
        if (!isNaN(Number(strItem)) && strItem !== "") {
          const num = Number(strItem);
          numbers.push(strItem);
          
          // Check prime
          if (num > 1) {
            let isPrime = true;
            for (let i = 2; i <= Math.sqrt(num); i++) {
              if (num % i === 0) {
                isPrime = false;
                break;
              }
            }
            if (isPrime) is_prime_found = true;
          }
        } else if (strItem.length === 1 && /[a-zA-Z]/.test(strItem)) {
          alphabets.push(strItem);
        }
      });

      // Determine highest lowercase alphabet
      const lowercases = alphabets.filter(char => char >= 'a' && char <= 'z');
      if (lowercases.length > 0) {
        lowercases.sort();
        highest_lowercase.push(lowercases[lowercases.length - 1]);
      }
    }

    // File validation logic
    let file_valid = false;
    let file_mime_type = "";
    let file_size_kb = "";

    if (file_b64 && typeof file_b64 === 'string') {
      let base64String = file_b64;
      
      // Handle scenario where mime type is prefixed
      if (file_b64.includes("base64,")) {
        const parts = file_b64.split("base64,");
        file_mime_type = parts[0].replace("data:", "").replace(";", "");
        base64String = parts[1];
        file_valid = true;
      } else {
        // Best effort inference if no mime type is provided
        if (base64String.startsWith('/9j/')) file_mime_type = 'image/jpeg';
        else if (base64String.startsWith('iVBORw0KGgo')) file_mime_type = 'image/png';
        else if (base64String.startsWith('JVBERi0')) file_mime_type = 'application/pdf';
        else file_mime_type = 'application/octet-stream'; // Default generic fallback
        
        // Basic validation check
        const base64Regex = /^[A-Za-z0-9+/=]+$/;
        if (base64Regex.test(base64String)) {
          file_valid = true;
        }
      }

      if (file_valid) {
        const buffer = Buffer.from(base64String, "base64");
        file_size_kb = (buffer.length / 1024).toFixed(2);
      }
    }

    // Response structure
    res.status(200).json({
      is_success: true,
      user_id: "Keshav_Patidar_04082004",     // Ensure this format is your_name_ddmmyyyy
      email: "keshavpatidar231235@acropolis.in",            // Ensure this is your college email
      roll_number: "0827CI231060",           // Ensure this is your roll number
      numbers,
      alphabets,
      highest_lowercase_alphabet: highest_lowercase,
      is_prime_found,
      file_valid,
      file_mime_type,
      file_size_kb
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ is_success: false, error: "Internal Server Error" });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server API is running on port ${PORT}`);
});
