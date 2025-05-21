import express from 'express';

import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());


const PORT = 3100;

app.get('/', (req, res) => {
    res.send('ola!');
})





app.listen(PORT, () => {
    console.log(`servidor rodando na  http://localhost:${PORT}`);
});