import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const { nombre, cantidadPersonas, notas } = req.body;
    const fecha = new Date().toLocaleString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Invitados!A2:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[fecha, nombre, cantidadPersonas, notas]],
      },
    });

    res.status(200).json({ message: 'RSVP registrado exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al registrar RSVP' });
  }
} 