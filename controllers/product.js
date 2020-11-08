const { ObjectId } = require('mongodb');
const { mongoUtils, dataBase } = require('../lib/utils/mongo.js');
const COLLECTION_NAME = 'productos';

async function getProducts() {
  const client = await mongoUtils.conn();
  const products = await client
    .db(dataBase)
    .collection(COLLECTION_NAME)
    .find({})
    .toArray()
    .finally(() => client.close());
  return products;
}

function insertProduct(product) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .insertOne(product)
      .finally(() => client.close());
  });
}

async function getProductById(id) {
  return mongoUtils.conn().then(async (client) => {
    const product = await client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .findOne(ObjectId(id))
      .finally(() => client.close());
    console.log(product);
    return product;
  });
};

module.exports = [getProducts, insertProduct, getProductById];
