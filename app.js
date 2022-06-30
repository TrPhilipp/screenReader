import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import router from './router.js';
import { PORT } from './constants.js';

const app = express();

app.use(fileUpload());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('static'));
app.use(cors());
app.use(router);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
