// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { sqlQuery } from '@lib/db';
import { User } from '@lib/types';

const userFields = ['me_id', 'me_email', 'me_firstname', 'me_name'];

export default async function handler(req: NextApiRequest, res: NextApiResponse<{success: boolean; message?: string; data?: User[]}>) {
  try {
    const sql = `SELECT ${userFields.join(', ')} FROM members`;  
    const results: User[] = await sqlQuery(sql);
    
    res.status(200).json({success: true, data: results});
  }
  catch(err: any) {
    res.status(500).json({ success: false, message: err });
  }
}