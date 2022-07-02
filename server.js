require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:8888"],
  }),
);
app.use(cors());
app.use(bodyParser.json());
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
app.use("/users", userRoute);
app.use("/admin", adminRoute);
app.listen(PORT, () => {
  console.log(`listen on ${PORT}`);
});
