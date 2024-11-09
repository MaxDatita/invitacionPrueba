import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

interface Mensaje {
  fecha: string;
  nombre: string;
  mensaje: string;
}

type ResponseData = {
  success?: boolean;
  mensajes?: Mensaje[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  console.log('Método recibido:', req.method);
  
  try {
    if (!process.env.GOOGLE_SHEET_ID) {
      console.error('GOOGLE_SHEET_ID no está configurado');
      return res.status(500).json({ error: 'Error de configuración del servidor' });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const range = 'Mensajes!A:C';

    if (req.method === 'GET') {
      console.log('Obteniendo mensajes de Google Sheets');
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range,
      });

      console.log('Respuesta de Google Sheets:', response.data.values);

      const mensajes = (response.data.values || [])
        .slice(1)
        .filter(row => row && row.length >= 3)
        .map(([fecha, nombre, mensaje]) => ({
          fecha: fecha || '',
          nombre: nombre || '',
          mensaje: mensaje || ''
        }))
        .filter(m => m.nombre && m.mensaje);

      console.log('Mensajes procesados:', mensajes);
      return res.status(200).json({ mensajes });
    }

    if (req.method === 'POST') {
      const { nombre, mensaje } = req.body;
      
      if (!nombre || !mensaje) {
        return res.status(400).json({ error: 'Nombre y mensaje son requeridos' });
      }

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[new Date().toISOString(), nombre, mensaje]]
        }
      });

      return res.status(200).json({ success: true });

    } else {
      return res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error detallado en API:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
} 