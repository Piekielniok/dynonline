import mysql from 'mysql2';
import { nanoid } from 'nanoid';

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'dynonline'
}).promise();

export async function checkUrl(url) {
  const [rows] = await pool.query(`SELECT id FROM results WHERE url = ?`, [url]);
  return rows[0];
}

export async function saveResult(type, data) {
  const url = nanoid(8);
  const url_id = await checkUrl(url);
  if (url_id === undefined) {
    // console.log(type, data);
    const [result] = await pool.query(`INSERT INTO results (url, type, data) VALUES (?, ?, ?)`, [url, type, JSON.stringify(data)]);
    const id = result.insertId;
    if (id !== 0) {
      return [201, url];
    }
    else {
      return [500, url];
    }
  }
  else {
    saveResult(type, data);
  }
}

export async function getResult(id) {
  if (id !== 0) {
    const [result] = await pool.query(`SELECT type, creation_date, data FROM results WHERE id = ?`, [id]);
    return [200, result[0]];
  }
  else {
    return [500];
  }
}