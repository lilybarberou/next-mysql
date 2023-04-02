import type { NextApiRequest, NextApiResponse } from 'next'
import { sqlQuery } from '@lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{success: boolean; message?: string; data?: any}>) {
  try {
    const sql = `SELECT SUM(co_amount) as co_amount, SUM(co_bonus) as co_bonus, SUM(pu_amount) as pu_amount FROM contributions, purchases`;  
        const results = await sqlQuery(sql);
        const result = results[0];
        const sum = Number(result.co_amount) + Number(result.co_bonus) - Number(result.pu_amount);
        
        res.status(200).json({success: true, data: sum});
  }
  catch(err: any) {
    console.log(err);
    
    res.status(500).json({ success: false, message: err });
  }
}