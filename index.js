import express from 'express';
const app = express();
import Routes from './routes/index.js';

app.use(express.json());
app.use('', Routes);

app.listen(4000, () => console.log('Server running on port 4000'))