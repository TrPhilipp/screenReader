import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import router from './router.js';
import { PORT } from './constants.js';

const app = express();

app.use(fileUpload());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.static('static'));
app.use(router);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
