// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { sqlQuery } from '@lib/db'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltRounds = 10;

type Response = {
  success: boolean;
  message?: string;
  access_token?: string;
  data?: {
    id: number;
    role: number;
    email: string;
    name: string;
    firstname: string;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const data = JSON.parse(req.body);
    
    const sql = `SELECT id, role, name, firstname, password FROM users WHERE email = ?`;
    const result = await sqlQuery(sql, [data.email]);

    if (result.length === 0) {
      res.status(404).json({success: false, message: 'Utilisateur inexistant'});
      return;
    }

    if (!bcrypt.compareSync(data.password, result[0].password)) {
      res.status(401).json({success: false, message: 'Mot de passe incorrect'});
      return;
    }

    delete result[0].password;
    const access_token = jwt.sign({ email: data.email, id: result[0].id }, process.env.JWT, { expiresIn: '30d' });

    res.status(200).json({success: true, access_token, data: result[0]});
    return;
  }
  catch(err: any) {
    res.status(500).json({ success: false, message: err });
  }
}