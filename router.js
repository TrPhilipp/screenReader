import { Router } from 'express';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { FOLDER, API_KEY } from './constants.js';

const router = new Router();

const __dirname = path.resolve();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

router.post('/screen', async (req, res) => {
  try {
    const image = req['files'].screen;
    const fileName = uuidv4();
    const textPath = path.resolve('static', `${fileName}.txt`);
    const imageBase64 = Buffer.from(image.data).toString('base64');

    const response = await fetch(
      'https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze',
      {
        method: 'POST',
        headers: {
          Authorization: `Api-Key ${API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          folderId: `${FOLDER}`,
          analyze_specs: [
            {
              content: imageBase64,
              features: [
                {
                  type: 'TEXT_DETECTION',
                  text_detection_config: {
                    language_codes: ['*'],
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const allText = data.results[0].results[0].textDetection.pages[0].blocks;

    fs.open(textPath, 'w', (err) => {
      if (err) throw err;
    });

    const ws = fs.createWriteStream(textPath);

    for (let i = 0; i < allText.length; i++) {
      const paragraph = allText[i].lines;
      for (let j = 0; j < paragraph.length; j++) {
        const fullParagraph = paragraph[j].words
          .reduce((acc, el) => {
            acc.push(el.text);
            return acc;
          }, [])
          .join(' ');

        ws.write(fullParagraph + '\n');
      }
    }

    image.mv(path.resolve('static', `${fileName}.png`));

    res.status(200).json({ msg: 'Success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
