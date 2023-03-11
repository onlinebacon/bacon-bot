import express from 'express';
import path from 'path';
import fs from 'fs';
const DIR = './data';
const app = express();
app.put('/:filename', (req, res) => {
    const { filename } = req.params;
    const stream = fs.createWriteStream(path.join(DIR, filename));
    req.on('error', (err) => {
        console.error(err);
        res.status(500).end();
    });
    req.on('data', chunk => stream.write(chunk));
    req.on('end', () => {
        res.status(201).end();
        stream.end();
    });
});
app.get('/ping', (req, res) => {
    const text = `Pong\nYour IP is ${req.socket.remoteAddress}`;
    res.status(200);
    res.set({
        'content-type': 'text/plain',
        'content-length': text.length,
    });
    res.write(text);
    res.end();
});
app.listen(80, () => {
    console.log('API started');
});
