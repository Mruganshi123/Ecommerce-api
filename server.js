require('dotenv').config();
const app = require("./app");
const connectDB = require("./src/config/db.config");
connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("server is listening on port", port);
});