const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mainRouter = require("./routes/index.js");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1", mainRouter);

const PORT = 7070;

app.listen(PORT, () => {
  console.log(`Server is listening at port no. ${PORT}`);
});