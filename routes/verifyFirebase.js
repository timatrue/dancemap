const admin = require("firebase-admin");

const checkAuth = (req, res, next) => {
  const idToken = req.cookies.token || "";

  //if(!idToken) return res.status(401).send('Access denied');
  if(!idToken) return res.redirect('/login');

  verifyToken(idToken)
    .then(uid => {
      next();
    })
    .catch(error => {
      //res.status(400).send('Invalid token');
      res.redirect('/login')
    })
}


const verifyToken = async function getUserFID(idToken) {
// idToken comes from the client app
  return await admin
    .auth()
    .verifyIdToken(idToken)
    .then(function(decodedToken) {
      let uid = decodedToken.uid;
      console.log('getUserFID', uid)
      return uid;
    })
}


module.exports.checkAuth = checkAuth;