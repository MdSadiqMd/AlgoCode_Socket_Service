import express, { Request, Response } from "express";
import BodyParser from 'body-parser';
import { PORT } from './config/server.config';

const app = express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.text());

app.listen(PORT, async () => {
    console.log(`server started at ${PORT}`);
});