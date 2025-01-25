import express from 'express';
import { checkUrl, saveResult, getResult } from './database.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/results/save', async (req, res) => {
  const { type, data } = req.body;
  const dbRes = await saveResult(type, data);
  res.status(dbRes[0]).send(dbRes[1]);
});

app.post('/results/checkurl', async (req, res) => {
  const id = await checkUrl('sda53fsa');
})

app.get('/results/:id', async (req, res) => {
  const idObj = await checkUrl(req.params.id);
  if (idObj !== undefined) {
    if (idObj.id !== 0) {
      const dbRes = await getResult(idObj.id);
      if (dbRes[0] === 200) {
        res.status(dbRes[0]).send(dbRes[1]);
      }
      else {
        res.status(dbRes[0]).send();
      }
    }
  }
  else {
    res.status(404).send();
  }
})

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});