const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const morgan = require('morgan');
const helmet = require('helmet');
const {urlencoded} = require('express');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const courses = require('./routes/courses');
const home = require('./routes/home');


app.set('view engine','pug');
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(logger);
app.use(urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

console.log('Aplication Name: ' + config.get('name'));
console.log('Mail Server: ' +config.get('mail.host'));
console.log('Mail Password: ' +config.get('mail.password'));

if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled');
}

dbDebugger('Connected to the Database...');

app.use(function (req, res, next){
    console.log('Authenticating...');
    next();
})

app.get('/', (req, res) => {
    res.render('index', {title: 'My Express App', message: 'Hello'});
});

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
