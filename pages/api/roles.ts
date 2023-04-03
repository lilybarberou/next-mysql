import type { NextApiRequest, NextApiResponse } from 'next'
import { sqlQuery } from '@lib/db';
import { User } from '@lib/types';

const roleFields = ['ro_id', 'ro_label', 'ro_amount'];

export default async function handler(req: NextApiRequest, res: NextApiResponse<{success: boolean; message?: string; data?: User[]}>) {
  try {
    let whereFields = {stmt: '', values: [] as any[]};

    // UPDATE USER
    if (req.method === 'PUT') {
      if (!req.body) res.status(401).json({success: false, message: 'Aucune donnée passée'});
      const body = JSON.parse(req.body);
        if (body?.ro_id) {
          whereFields.stmt += 'ro_id = ?';
          whereFields.values.push(body.ro_id);
        }
      
      const sql = `UPDATE roles SET ro_amount = ? ${whereFields.stmt ? 'WHERE ' + whereFields.stmt : ''}`;  
      const results = await sqlQuery(sql, [body.ro_amount, ...whereFields.values]);
      
      res.status(200).json({success: true, data: results});
    }
    // GET USER
    else if (req.method === 'GET') {
      const sql = `SELECT ${roleFields.join(', ')} FROM roles`;  
      const results: User[] = await sqlQuery(sql);
      
      res.status(200).json({success: true, data: results});
    }
  }
  catch(err: any) {
    res.status(500).json({ success: false, message: err });
  }
}