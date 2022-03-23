
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
require('dotenv').config();

const apiKey = `${process.env.apiKEY}`;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.get('/', (req, res) =>{
    res.render('index', { weather: null, error: null });
});
app.post('/', (req, res) => {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=`+city+`&units=metric&appid=`+apiKey;
    request(url, function(err, response, body) {
        if (err) {
            res.render('index', { weather: null, error: 'Error' });
        } 
        else {
            let weather = JSON.parse(body);
            console.log(weather);
            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Error' });
            } 
            else {
                res.render('index', { 
                    weather: weather, 
                    place: `${weather.name}, ${weather.sys.country}`, 
                    temp: weather.main.temp, 
                    pressure: weather.main.pressure, 
                    icon: `http://openweathermap.org/img/wn/`+weather.weather[0].icon+`@2x.png`, 
                    description: weather.weather[0].description, 
                    timezone: `${new Date(weather.dt * 1000 - (weather.timezone * 1000))}`, 
                    humidity: weather.main.humidity, 
                    fahrenheit: Math.round((weather.main.temp * 9 / 5) + 32), 
                    clouds: weather.clouds.all, 
                    visibility: weather.visibility, 
                    main: weather.weather[0].main, error: null });
            }
        }
    });
});
app.listen(4000, function() {
    console.log('Listener setup on port 4000');
});