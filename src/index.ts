import 'dotenv/config';
import express from 'express';
import { Server } from 'ws';
import cors from 'cors';
import routes from './routes';
import { version } from '../package.json';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ limit: '4mb', extended: false }));
app.use(cors({ maxAge: 86400 }));
app.get('/', (req, res) => res.json({ version, port: PORT }));

const server = app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
const wss = new Server({ server });

wss.on('connection', ws => {
  console.log('Got connection from new peer');
  ws.on('error', () => console.log('Error on connection with peer'));
  ws.on('close', () => console.log('Connection with peer closed'));
  ws.on('message', async message => {
    try {
      const call = JSON.parse(message);
      if (call[0] && call[0] === 'request' && call[1] && call[1].command) {
        const { command, params, tag } = call[1];
        await routes[command](params, tag, ws);
      }
    } catch (e) {
      console.error(e);
    }
  });
});
