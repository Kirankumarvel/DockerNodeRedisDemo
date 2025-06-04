const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient({
    host: 'redis',
    port: 6379
});

client.on('error', (err) => console.log('Redis Client Error', err));

app.get('/', async (req, res) => {
    try {
        await client.connect();
        let visits = await client.get('visits');
        visits = visits ? parseInt(visits) + 1 : 1;
        await client.set('visits', visits.toString());
        res.send(`Number of visits is ${visits}`);
        await client.quit();
    } catch (err) {
        res.send('Error connecting to Redis');
        console.error(err);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
