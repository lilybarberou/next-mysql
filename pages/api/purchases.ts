import type { NextApiRequest, NextApiResponse } from 'next'
import { sqlQuery } from '@lib/db';

const purchasesFields = ['pu_id', 'pu_member', 'pu_amount', 'pu_date', 'pu_label'];

export default async function handler(req: NextApiRequest, res: NextApiResponse<{success: boolean; message?: string; data?: any}>) {
  try {
    let whereFields = {stmt: '', values: [] as any[]};

    if (req.method === 'POST') {
      if (!req.body) res.status(401).json({success: false, message: 'Aucune donnée passée'});
        const body = JSON.parse(req.body);

        const sql = `INSERT INTO purchases SET ?`;  
        const results = await sqlQuery(sql, [body]);
      
        res.status(200).json({success: true, data: results});
    }
    // GET USER
    else if (req.method === 'GET') {
        if (req.query?.pu_id) {
            whereFields.stmt += 'pu_id = ?';
            whereFields.values.push(req.query.pu_id);
        }

        const sql = `SELECT ${purchasesFields.join(', ')} FROM purchases ${whereFields.stmt}`;  
        const results = await sqlQuery(sql, whereFields.values);
        
        res.status(200).json({success: true, data: results});
    }
  }
  catch(err: any) {
    res.status(500).json({ success: false, message: err });
  }
}