import express, { Request, Response } from "express";
import BodyParser from 'body-parser'

const app = express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.text());

app.listen(3000, async () => {
  console.log(`server started at ${3000}`);
});