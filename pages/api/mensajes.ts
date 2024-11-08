import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    if (req.method === 'POST') {
      const { nombre, mensaje } = req.body;
      const fecha = new Date().toLocaleString();
      const id = Date.now();

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "'Mensajes'!A2:D",
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[id, fecha, nombre, mensaje]],
        },
      });

      return res.status(200).json({ id, nombre, mensaje });
    }

    if (req.method === 'GET') {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "'Mensajes'!A2:D",
      });

      const rows = response.data.values || [];
      const mensajes = rows.map(row => ({
        id: row[0],
        nombre: row[2],
        mensaje: row[3]
      }));

      return res.status(200).json(mensajes);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
}
