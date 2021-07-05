const express = require('express');
const postsRouter = require('../posts/posts-router');

const server = express();

server.get('/', (req, res) => {
    res.send(`
    <h2>Posts API</h2>
    <p>Welcome to the Posts API</p>
    `);
});

server.use('/api/posts', postsRouter)

module.exports = server;