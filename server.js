const express = require('express');
//const serverless = require('serverless-http');
const https=require('https');
const fs= require('fs');
// const path = require('path');

const app = express();
const PORT = process.env.PORT ||3000;

const urlMap = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });
app.use(express.static('public'));

app.post('/shorten', (req, res) => {
  const originalUrl = req.body.originalUrl;
  const customShortcode = req.body.customShortcode; // Add this line to get custom shortcode

  if (customShortcode && urlMap[customShortcode]) {
    return res.status(400).json({ error: 'Custom shortcode is already in use.' });
  }

  const shortUrl = customShortcode || generateShortUrl();
  urlMap[shortUrl] = originalUrl;
  res.json({ shortUrl: `http://localhost:${PORT}/${shortUrl}` });
});

// app.get('/:id', (req, res)=> {
//     console.log(req.params);
//     res.send('hi')
// })
app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const originalUrl = urlMap[shortUrl];
  if (originalUrl) {
    res.redirect(301, originalUrl); // Use a permanent redirect (301)
  } else {
    res.status(404).send('Not Found');
  }
});

function generateShortUrl() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortUrl = '';

  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortUrl += characters.charAt(randomIndex);
  }

  return shortUrl;
}

// Wrap the Express app with serverless
// module.exports.handler = serverless(app);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
