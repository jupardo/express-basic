var express = require('express');
var router = express.Router();
var [createUser, login] = require('../controllers/user');

/* Create user. */
router.post('/register', async function(req, res, next) {
  try {
    const newUser = await createUser(req.body);
    res.setHeader("token",newUser.token);
    res.send(newUser);
  } catch(error) {
    res.status(400);
    res.send(error);
  }
  
  
});
/** Login */
router.post('/login', async function(req, res, next) {
  try {
    const authUser = await login(req.body);
    res.setHeader("token",authUser.token);
    res.send(authUser);
  } catch(error) {
    res.status(401);
    res.send(error);
  } 
});

module.exports = router;
