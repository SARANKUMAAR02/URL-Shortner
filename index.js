const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/myurlShortener");

const { UrlModel } = require("./models/urlshort");
// Middleware
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  UrlModel.find({})
    .then((result) => {
      res.render("home", {
        urlResult: result,
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

app.post("/create", (req, res) => {
  let urlShort = new UrlModel({
    longUrl: req.body.longurl,
    shortUrl: generateUrl(),
  });

  urlShort
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/:urlId", (req, res) => {
  UrlModel.findOne({ shortUrl: req.params.urlId }).then((data, err) => {
    if (err) throw err;

    UrlModel.findByIdAndUpdate({ _id: data.id }, { $inc: { clickCount: 1 } })
      .then((data, err) => {
        if (err) throw err;
        res.redirect(data.longUrl);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

app.get("/delete/:id", (req, res) => {
  UrlModel.findByIdAndDelete({
    _id: req.params.id,
  }).then(() => {
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log(`Listening port ${3000}`);
});

const generateUrl = () => {
  var rndResult = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  characterslength = characters.length;

  for (var i = 0; i < 5; i++) {
    rndResult += characters.charAt(
      Math.floor(Math.random() * characterslength)
    );
  }
  return rndResult;
};
