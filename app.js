const express = require('express');
const app = express();
const cors = require('cors');
const  cookieParser=require('cookie-parser');
//db
const mongoose = require('mongoose');
const connectiondb = mongoose.connect('mongodb+srv://yousaf:yousaf03448307585@cluster0.igtgl.mongodb.net/?retryWrites=false&w=majority').then((data) => console.log('DB Coonected...')).catch(e => console.log("db conn err", e))


app.use(cookieParser())
app.use(cors('*'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// user route
app.use('/api/v1',require('./routes/user'));
// post  rouete
app.use('/api/v1',require('./routes/post'));


app.use((req, res, next) => {
    const error = new Error('Page not found 404');
    error.status = 404;
    next(error)
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});
app.use(function (req, res, next) {
    res.locals.message = req.flash();
    next();
});


app.listen(4000, () => console.log('app  started backend port 4000'));
