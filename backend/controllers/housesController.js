// backend/controllers/housesController.js
const HouseModel = require('../models/House');

exports.getAllHouses = async (req, res) => {
    try {
        const houses = await HouseModel.find({});
        res.send(houses);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getHouseByblockchainId = async (req, res) => {
    const { blockchainId } = req.params;
    console.log(`getbyblockchainId house with blockchainId type: ${typeof blockchainId}, value: ${blockchainId}`);

    console.log("Aranan blockchainId:", req.params.blockchainId);
    try {
        // blockchainblockchainId'ye göre evi bul
        const house = await HouseModel.findOne({ blockchainId: req.params.blockchainId })
       console.log("Bulunan ev:", house)
         
         console.log("MongoDB Sorgusu için kullanılan blockchainId:", blockchainId);
        if (!house) {
            return res.status(404).send({ message: "House not found" });
        }
        res.send(house);
    } catch (error) {
        console.error("Error fetching house by blockchainblockchainId:", error.message);
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
};


exports.createHouse = async (req, res) => {
    // req.body'den gelen veriler
    const { blockchainId, title, description, price, totalShares, sharesSold, houseOwner, imageUrl  } = req.body;
    console.log('Received headers:', req.headers);
    console.log("req.body from create house",req.body);

    // Yeni ev oluşturma
    const house = new HouseModel({
        blockchainId,
        title,
        description,
        price,
        totalShares,
        sharesSold,
        houseOwner,
        imageUrl, 
    });

    try {
        await house.save();
        res.status(201).json({ message: 'Ev başarıyla oluşturuldu', house });
    } catch (error) {
        res.status(400).json({ message: 'Ev oluşturulurken bir hata oluştu', error });
    }
};


// housesController.js

exports.updateHouse = async (req, res) => {
    const { blockchainId } = req.params;
    console.log("Updating house with blockchainId:", blockchainId);
    // Güncelleme işlemi...
    try {
        const updatedHouse = await HouseModel.findOneAndUpdate({ blockchainId }, req.body, { new: true });
        if (!updatedHouse) {
            return res.status(404).send("House not found");
        }
        res.send(updatedHouse);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteHouse = async (req, res) => {
    const { blockchainId } = req.params;
    console.log("Deleting house with blockchainId:", blockchainId);
    // Silme işlemi...
    try {
        const deletedHouse = await HouseModel.findOneAndDelete({ blockchainId }, req.body, { new: true });
        if (!deletedHouse) {
            return res.status(404).send("House not found");
        }
        res.send({ message: "House deleted successfully" });
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.buyShares = async (req, res) => {
    const { blockchainId } = req.params;
    const { sharesToBuy } = req.body; // Frontend'den gelen satın alınacak hisse sayısı

    try {
        // Evin mevcut durumunu bul
        const house = await HouseModel.findOne(blockchainId);
        if (!house) {
            return res.status(404).send({ message: "House not found" });
        }

        // Satılan hisse sayısını güncelle
        house.sharesSold += sharesToBuy;
        await house.save();

        res.send(house);
    } catch (error) {
        res.status(500).send({ message: "An error occurred", error });
    }
};


exports.syncHouse = async (req, res) => {
    const { blockchainId, title, description, price, totalShares, houseOwner, imageUrl, sharesSold  } = req.body;

    try {
        const updatedHouse = await HouseModel.findOneAndUpdate(
            { blockchainId }, // Bulunacak evin kriteri
            {
                // Güncellenecek alanlar
                title,
                description,
                price,
                totalShares,
                houseOwner,
                imageUrl,
                sharesSold
            },
            {
                new: true, // Geriye güncellenmiş dokümanın döndürülmesi
                upsert: true // Eğer doküman bulunamazsa, yeni bir doküman oluştur
            }
        );

        if(updatedHouse) {
            res.json({ message: "Ev başarıyla güncellendi/oluşturuldu", house: updatedHouse });
        } else {
            res.status(404).json({ message: "Ev bulunamadı ve oluşturulamadı" });
        }
    } catch (error) {
        res.status(500).send({ message: "Senkronizasyon sırasında bir hata oluştu", error: error.message });
    }
};



exports.deleteAllHouses = async (req, res) => {
    try {
      await HouseModel.deleteMany({});
      res.send('Tüm ev kayıtları başarıyla silindi.');
    } catch (error) {
      console.error('Ev kayıtları silinirken bir hata oluştu:', error);
      res.status(500).send('Bir hata oluştu.');
    }
  };
