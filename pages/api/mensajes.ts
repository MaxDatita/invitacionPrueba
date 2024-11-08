import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      const sheets = google.sheets({ version: 'v4', auth });
      
      const { nombre, mensaje } = req.body;
      const range = 'Mensajes!A:C';
      
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[new Date().toISOString(), nombre, mensaje]]
        }
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al guardar el mensaje' });
    }
  }
} 