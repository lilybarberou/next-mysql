import type { NextApiRequest, NextApiResponse } from 'next'
import { sqlQuery } from '@lib/db'
import jwt from 'jsonwebtoken';
import { User } from '@lib/types';

type Response = {
  success: boolean;
  message?: string;
  access_token?: string;
  data?: User
}

type Token = {
    me_id: number;
    me_email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const access_token = req.body;
    const decoded = jwt.verify(access_token, process.env.JWT) as Token;
    
    const sql = `SELECT me_id, me_role, me_name, me_firstname, me_password FROM members WHERE me_id = ? AND me_email = ?`;
    const result = await sqlQuery(sql, [decoded.me_id, decoded.me_email]);
    
    if (result.length === 0) throw { message: 'Token invalide'};
    res.status(200).json({success: true, data: result[0]});  
  }
  catch(err: any) {
    res.status(401).json({ success: false, message: err.message });
  }
}