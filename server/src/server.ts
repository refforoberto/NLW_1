import express from 'express';
import path from 'path';
import routes from './routes';
import cors from 'cors';
import { errors } from 'celebrate';

const app = express();

// para express entender parametros json (body)
app.use(express.json());
app.use(cors());

// servir arquivos estáticos de uma pasta especifica
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(routes);
app.use(errors);


app.listen(3333);