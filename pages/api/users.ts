import type { NextApiRequest, NextApiResponse } from 'next'
import { sqlQuery } from '@lib/db';
import { User } from '@lib/types';
import bcrypt from 'bcrypt';
const saltRounds = 10;

const userFields = ['me_id', 'me_role', 'me_email', 'me_firstname', 'me_name'];

export default async function handler(req: NextApiRequest, res: NextApiResponse<{success: boolean; message?: string; data?: User[]}>) {
  try {
    let whereFields = {stmt: '', values: [] as any[]};

    // UPDATE USER
    if (req.method === 'PUT') {
      if (!req.body) return res.status(401).json({success: false, message: 'Aucune donnée passée'});
      if (req.body) {
        const body = JSON.parse(req.body);
        if (body?.me_id) {
          whereFields.stmt += 'me_id = ?';
          whereFields.values.push(body.me_id);
        }
      }
      
      const sql = `UPDATE members SET ? ${whereFields.stmt ? 'WHERE ' + whereFields.stmt : ''}`;  
      const results = await sqlQuery(sql, [JSON.parse(req.body), ...whereFields.values]);
      
      res.status(200).json({success: true, data: results});
    }
    else if (req.method === 'POST') {
      if (!req.body) return res.status(401).json({success: false, message: 'Aucune donnée passée'});
      const body = JSON.parse(req.body);

      const checkEmailSql = "SELECT me_id FROM members WHERE me_email = ? AND me_deleted = 0";
      const checkEmail = await sqlQuery(checkEmailSql, [body.me_email]);
      if (checkEmail.length > 0) return res.status(401).json({success: false, message: 'Cet email existe déjà'});

      const hash = bcrypt.hashSync(body.me_password, saltRounds);
      body.me_password = hash;

      const sql = `INSERT INTO members SET ?`;  
      const results = await sqlQuery(sql, [body]);
      
      res.status(200).json({success: true, data: results});
    }
    // GET USER
    else if (req.method === 'GET') {
      // deleted 0
      whereFields.stmt += 'WHERE me_deleted = ?';
      whereFields.values.push(0);

      if (req.query?.me_id) {
        whereFields.stmt += ' AND me_id = ?';
        whereFields.values.push(req.query.me_id);
      }

      const sql = `SELECT ${userFields.join(', ')} FROM members ${whereFields.stmt}`;  
      const results: User[] = await sqlQuery(sql, whereFields.values);
      
      res.status(200).json({success: true, data: results});
    }
    else if (req.method === 'DELETE') {
      if (!req.body) return res.status(401).json({success: false, message: 'Aucune donnée passée'});
      if (req.body) {
        const body = JSON.parse(req.body);
        if (body?.me_id) {
          whereFields.stmt += 'me_id = ?';
          whereFields.values.push(body.me_id);
        }
      }
      
      const sql = `DELETE FROM members ${whereFields.stmt ? 'WHERE ' + whereFields.stmt : ''}`;  
      await sqlQuery(sql, whereFields.values);
      
      res.status(200).json({success: true});
    }
  }
  catch(err: any) {
    res.status(500).json({ success: false, message: err });
  }
}