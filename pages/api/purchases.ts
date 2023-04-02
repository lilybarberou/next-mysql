import type { NextApiRequest, NextApiResponse } from 'next'
import { sqlQuery } from '@lib/db';
import { Purchase } from '@lib/types';

const purchaseFields = ['id', 'amount', 'date'];

type Response = {
    success: boolean;
    message?: string;
    data?: Purchase[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const sql = `SELECT ${purchaseFields.join(', ')} FROM purchases`;  
    const results = await sqlQuery(sql);
    
    res.status(200).json({success: true, data: results});
  }
  catch(err: any) {
    res.status(500).json({ success: false, message: err });
  }
}