import express, { Application } from "express";
import 'dotenv/config';
import evaluationRoute from './routes/evaluationRoute';

const port = process.env.PORT;
const app: Application = express();

app.use(express.json())

app.use('/evaluation', evaluationRoute)

app.listen(port)

