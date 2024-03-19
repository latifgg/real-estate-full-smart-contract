// backend/routes/houses.js
const express = require('express');
const router = express.Router();
const housesController = require('../controllers/housesController');


router.get('/', housesController.getAllHouses);
router.post('/', housesController.createHouse);
router.post('/sync', housesController.syncHouse);
router.get('/:blockchainId', housesController.getHouseByblockchainId);
router.patch('/:blockchainId', housesController.updateHouse);
router.delete('/:blockchainId', housesController.deleteHouse);
router.patch('/:blockchainId/buy-shares', housesController.buyShares);
router.delete('/deleteAll', housesController.deleteAllHouses);

module.exports = router;
