require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT ||5000;

const app = express();
//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    useTempFiles: true
}));

// connect to mongodb
require('./model/index');

app.use('/user', require('./routes/userRoute'));
app.use('/api', require('./routes/categoryRoute'));


app.get('/',(req,res) => {
    res.json({msg: 'Welcome'});
})

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});

