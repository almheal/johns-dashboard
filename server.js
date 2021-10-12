const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;

app.use("/", express.static(path.join(__dirname, "dist")));
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => console.log(`server started on ${PORT}`));
