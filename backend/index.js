const express = require("express");
const app = express();
const cors = require("cors")
const PORT = 3000;

app.use(express.json());
app.use(cors());

const rootRouter = require('./routes/index.js');


app.use('/api/v1', rootRouter);

app.listen(PORT, () => {
  console.log(`Port is running at ${PORT}`)
});
