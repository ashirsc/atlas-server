import 'dotenv/config'
import express from 'express';


import { reqTransform, senderVerification, logger, typingStartHandler,  } from './handlers/handler';
import { messageRouter } from './handlers/messageHandler';

const app = express();



app.use(express.json());
app.use(logger);
app.use(reqTransform)
app.use(senderVerification)
// app.use(typingStartHandler)




app.use(messageRouter)


app.all("/", (req, res, next) => {
  res.statusCode = 400
  res.send(`Message ${req.body.data.guid} was not caught by any hadlers in our system.`)
})

app.all("/", (err, req, res, next) => {
  res.statusCode = 500
  res.json(err)
})

app.listen(4242, () => {
  console.log('Server listening on port 4242');
});

