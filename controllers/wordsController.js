import { getDataPromise } from '../adapters/googleSheetsAdapter.js';

export async function getWords(req, res){
  const rows = await getDataPromise();
  res.json(rows);
}