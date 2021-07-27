require("dotenv").config();
const express = require("express");

const twilio = require("twilio");
const ngrok = require("ngrok");
const cors = require("cors");
const helmet = require("helmet");

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const app = express();

app.use(cors());

app.use(helmet());

app.get("/getToken", (req, res) => {
  if (!req.query || !req.query.userName) {
    return res.status(400).send("Username parameter is required");
  }
  const accessToken = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_SID,
    process.env.TWILIO_API_SECRET
  );

  // Set the Identity of this token
  accessToken.identity = req.query.userName;

  // Grant access to Video
  var grant = new VideoGrant();
  accessToken.addGrant(grant);

  // Serialize the token as a JWT
  var jwt = accessToken.toJwt();
  return res.send(jwt);
});

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}!`)
);

if (process.env.NODE_ENV === "development") {
  ngrok.connect(process.env.PORT).then((url) => {
    console.log(`Server forwarded to public url ${url}`);
  });
}
