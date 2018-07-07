const Koa = require('koa');
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const combineMiddleWare = require('./middleware');
const controller = require('./controllers');

const app = new Koa();

combineMiddleWare(app, __dirname);
app.use(cors());
app.use(bodyParser());
app.use(controller());

const LISTEN_PORT = 4897;
app.listen(LISTEN_PORT);
console.log(`app started at port ${LISTEN_PORT}`);

