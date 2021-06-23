const mongoose = require('mongoose');


const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('coonected to database');
});


const Users = require('./userModel');
const category = require('./categoryModel');
