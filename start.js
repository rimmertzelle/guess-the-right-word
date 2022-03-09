// start.js and pug setup from learnnode.com by Wes Bos
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config({ path: 'variables.env' });

// Start our app!

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
