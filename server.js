const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors');
const {DATABASE_URL, CLIENT_ORIGIN} = require('./config');
const userRouter = require('./routers/user-router');
const authRouter = require('./routers/auth-router');
const pageRouter = require('./routers/page-router');
 const {PORT} = require('./config');

app.use(
    cors()
);
app.use(morgan('common'));
mongoose.Promise = global.Promise;
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/pages', pageRouter);



 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });

//connects to the database, and starts the server
function runServer(databaseUrl, port =PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if(err) {
          return reject(err);
        }
        server = app
        .listen(port, () => {
          resolve();
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
      }
    );
  })
};

//disconnects from the database and closes the server
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
};

//clever!!! this basically allows for the app to run and use the DATABASE url if and only if the app is run from the server,
//and not from somewhere else
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.log(err));
};

 module.exports = {app, runServer, closeServer};