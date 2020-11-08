var express = require('express');
var router = express.Router();
var [getProducts, insertProduct, getProductById] = require('../controllers/product');
const auth = require('../lib/utils/auth.js')

/* GET product listing. */
router.get('/', async function (req, res, next) {
  const products = await getProducts();
  console.warn('products->', products);
  res.send(products);
});
/* GET specific product. */
router.get('/:id', async function (req, res, next) {
  const {id} = req.params;
  const product = await getProductById(id);
  console.warn('products->', product);
  res.send(product);
});
/**
 * POST product
 */
router.post('/', async function (req, res, next) {
  const newProduct = await insertProduct(req.body);
  console.warn('insert products->', newProduct);
  res.send(newProduct);
});
/**
 * DELETE product
 */
router.delete('/:id', async function (req, res, next) {
  const {id} = req.params;
  await deleteProduct(id);
  res.send();
});
module.exports = router;
