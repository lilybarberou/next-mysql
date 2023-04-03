import type { NextApiRequest, NextApiResponse } from 'next'
import { sqlQuery } from '@lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{success: boolean; message?: string; data?: any}>) {
  try {
    const contriSql = `SELECT SUM(co_amount) as co_amount, SUM(co_bonus) as co_bonus FROM contributions`;  
    const contriResults = await sqlQuery(contriSql);
    const contriResult = contriResults[0];

    const purchasesSql = `SELECT SUM(pu_amount) as pu_amount FROM purchases`;  
    const purchasesResults = await sqlQuery(purchasesSql);
    const purchasesResult = purchasesResults[0];
    
    const sum = Number(contriResult.co_amount) + Number(contriResult.co_bonus) - Number(purchasesResult.pu_amount);
    
    res.status(200).json({success: true, data: sum});
  }
  catch(err: any) {
    console.log(err);
    
    res.status(500).json({ success: false, message: err });
  }
}