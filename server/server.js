var express = require('express'),
    cors = require('cors'),
    app = express(),
    passport = require('passport'),
    port = process.env.PORT || 8081,
    products = require('./api/routes/productsRoutes'),
    product = require('./api/routes/productRoutes'),
    notifications = require('./api/routes/notificationsRouter'),
    auth = require('./api/routes/authRoutes'),
    customerResponseRoutes = require('./api/routes/customerResponseRoutes'),
    MongoClient    = require('mongodb').MongoClient,
    dbConfig = require('./db');
    require('./passport');
var path = require('path');
  //mongoose = require('mongoose'),
  Task = require('./api/models/productsModel'), //created model loading here
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/Tododb'); 

console.log('start');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/products', passport.authenticate('jwt', {session: false}), products);
app.use('/product', product);
app.use('/notification', passport.authenticate('jwt', {session: false}), notifications);
app.use('/auth',auth);
app.use('/customerResponse',customerResponseRoutes);

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', (req, res) => {
  console.log('route');
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

dbConfig.connect(function (err){
  app.listen(port); 
});

console.log('customer notifier RESTful API server started on: ' + port);