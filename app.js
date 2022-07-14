const express= require("express");

const https=require("https");
const ejs = require("ejs");
const request = require('request');
const mongoose=require('mongoose');
require('dotenv').config()

mongoose.connect("mongodb://localhost:27017/ipDB", {
  useNewUrlParser: true, useUnifiedTopology: true
});

const ipSchema = new mongoose.Schema({
  ip_address: String,
  country: String,
  continent: String,
  city: String,
  longitude: Number,
  latitude: Number,
});

const Ip=mongoose.model("Ip",ipSchema);
// const mymodule=require('mapbox-gl');

const app=express();
app.set('view engine', 'ejs');



app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

var latitude=19.0633;
var longitude=73.0079;
var object;

app.get("/form",function(req,res){
  res.render("form");
})

app.post('/form',function(req,response){
  var ip=req.body.ip;
  var ipURL=`https://ipfind.co/?ip=${ip}&auth=${process.env.API_KEY}`;
  request(ipURL, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body);
    object=body;
    longitude=body.longitude;
    latitude=body.latitude;
    console.log(longitude);
    const newIp=new Ip({
      ip_address: body.ip_address,
      country: body.country,
      continent: body.continent,
      city: body.city,
      longitude: body.longitude,
      latitude: body.latitude,
    });
    newIp.save(function(err){
      if(!err){
          console.log("Successfully added a new IP");
      }else{
          console.log(err);
      }
    });
    response.redirect('/');
  //   console.log(body.explanation);
  });
  // setTimeout(route,5000);
  
});

function route(){
  console.log(".");
  console.log(longitude);
}

app.get("/",function(req,res){
  // setTimeout(,5000);
  console.log(longitude);
    res.render("map",{longitude: longitude,latitude: latitude,object: object});
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });