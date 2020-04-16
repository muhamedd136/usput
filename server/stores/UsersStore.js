/** ovdje ce ici takodjer i login i register  */

const login = async (req, res, db, jwt, config) => {
  try {
    let jwtToken;

    await db.users.findOne({ username: req.body.username }, (err, doc) => {
      if (!doc) {
        return res.status(403).send({ message: "Incorrect username." });
      } else if (doc.password != req.body.password) {
        return res.status(403).send({ message: "Incorrect password." });
      } else {
        jwtToken = jwt.sign(
          {
            id: doc._id,
            username: doc.username,
            type: doc.type,
            exp: Math.floor(Date.now() / 1000) + 3600,
          },
          process.env.JWT_SECRET || config.JWT_SECRET,
          { algorithm: "HS256" }
        );

        res.send({
          user: doc,
          jwt: jwtToken,
        });
      }
    });
  } catch (err) {
    res.status(400).send(`Error: ${error}`);
  }
};

module.exports.login = login;
