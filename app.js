// app.js and pug setup from learnnode.com by Wes Bos
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import routes from './routes/index.js';

const app = express();
// solved https://stackoverflow.com/questions/64383909/dirname-is-not-defined-in-node-14-version
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// view engine setup
app.set('views', path.join(dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too

// serves up static files from the public folder.
// Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(dirname, 'public/')));

// all routes in a separated file
app.use('/', routes);

export default app;
