const { body } = require('express-validator');

const loginValidator = [
  body('username').isString().notEmpty().withMessage('Username wajib diisi'),
  body('password').isString().notEmpty().withMessage('Password wajib diisi'),
];

const productValidator = [
  body('name').isString().notEmpty().withMessage('Nama produk wajib diisi'),
  body('category')
    .isIn(['ayam', 'lele_fresh', 'lele_marinasi', 'telur', 'minyak'])
    .withMessage('Kategori tidak valid'),
  body('price').isNumeric().withMessage('Harga harus angka'),
  body('unit').isString().notEmpty().withMessage('Satuan wajib diisi'),
  body('status')
    .optional()
    .isIn(['available', 'preorder', 'out_of_stock'])
    .withMessage('Status tidak valid'),
];

module.exports = {
  loginValidator,
  productValidator,
};