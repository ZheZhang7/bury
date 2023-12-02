const express = require('express');
const cors = require('cors');
const app = express();

// 注入中间件，解决跨域
app.use(cors());

app.use(express.urlencoded({extends: false}));

app.post('/bury', (req, res) => {
    console.log(req.body);
    res.send('ok');
})

app.listen(9000, () => {
    console.log('9000 server is running...');
})