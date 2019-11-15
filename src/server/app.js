import express from 'express';

console.log('dsdsd');

const app = express();
const router = express.Router();

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.send('Trolooooo');
});

app.listen(5000);
