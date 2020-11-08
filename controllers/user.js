const { mongoUtils, dataBase } = require('../lib/utils/mongo.js');
const COLLECTION_NAME = 'users';
const bcrypt = require('bcrypt');
const auth = require('../lib/utils/auth.js');
const { exception } = require('console');
const { createToken } = require('../lib/utils/auth.js');
const saltRounds = 10;

async function login(user) {
    return mongoUtils.conn().then(async (client) => {
      const requestedUser = await client
        .db(dataBase)
        .collection(COLLECTION_NAME)
        .findOne({username: user.username})
        .finally(() => client.close());

        
      const isValid = await bcrypt.compare(user.password, requestedUser.password);
      // TODO create token
      if(!isValid) {
        throw new Error('Password doesn\'t match');
      }
      delete requestedUser.password;
      // Return user without sensitive data and JWT
      const token = createToken(JSON.stringify(requestedUser));
      return {token};
      
  });
  }

async function createUser(user) {
  if(!user.password){
      // TODO use bcrypt to hash password
      throw new exception('No password was provided!');
  }
  user.role = 'user';
  user.password = await bcrypt.hash(user.password, saltRounds);
  // Save new user with password hashed
  return mongoUtils.conn().then(async (client) => {
    const existingUser = await client
        .db(dataBase)
        .collection(COLLECTION_NAME)
        .findOne({username: user.username})
    if(existingUser) {
      throw new Error('User already exists');
    }
    const newUser = await client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .insertOne(user)
      .finally(() => client.close());
  // TODO Delete sensitive information
    // We should issue a new token with the user
    delete newUser.password;
    const token = createToken(JSON.stringify(newUser));
    return {token};
});
}

module.exports = [createUser, login];
