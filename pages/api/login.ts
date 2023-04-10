import type { NextApiRequest, NextApiResponse } from 'next'
import { sqlQuery } from '@lib/db'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@lib/types';

type Response = {
  success: boolean;
  message?: string;
  access_token?: string;
  data?: User
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const data = JSON.parse(req.body);
    
    const sql = `SELECT me_id, me_role, me_name, me_firstname, me_password FROM members WHERE me_email = ? AND me_deleted = 0`;
    const result = await sqlQuery(sql, [data.email]);

    if (result.length === 0) {
      res.status(404).json({success: false, message: 'Utilisateur inexistant'});
      return;
    }

    if (!bcrypt.compareSync(data.password, result[0].me_password)) {
      res.status(401).json({success: false, message: 'Mot de passe incorrect'});
      return;
    }

    delete result[0].me_password;
    const access_token = jwt.sign({ me_id: result[0].me_id, me_email: data.email }, process.env.JWT, { expiresIn: '30d' });
    
    res.status(200).json({success: true, access_token, data: result[0]});
    return;
  }
  catch(err: any) {
    res.status(500).json({ success: false, message: err });
  }
}