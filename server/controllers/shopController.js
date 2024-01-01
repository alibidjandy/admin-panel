const fs = require("fs");

const getDatabase = () => {
  const data = fs.readFileSync("./data/database.json");
  return JSON.parse(data);
};

const saveDatabase = (data) => {
  const existingData = getDatabase();
  const newData = { ...existingData, ...data };
  fs.writeFileSync("./data/database.json", JSON.stringify(newData, null, 2));
};

const shopController = {
  getAllShops: (req, res) => {
    const { shops } = getDatabase();
    res.json(shops);
  },

  getShopById: (req, res) => {
    const { shops } = getDatabase();
    const shop = shops.find((shop) => shop.id === req.params.id);
    if (shop) {
      res.json(shop);
    } else {
      res.status(404).json({ message: "Shop not found" });
    }
  },

  createShop: (req, res) => {
    const database = getDatabase();
    const newShop = {
      id: req.body.id,
      name: req.body.name,
      items: [], // Assuming initially the new shop doesn't have any items
      // Other shop details as per the schema
    };
    database.shops.push(newShop);
    saveDatabase(database);
    res.status(201).json(newShop);
  },

  updateShop: (req, res) => {
    const database = getDatabase();
    const shopIndex = database.shops.findIndex(
      (shop) => shop.id === req.params.id
    );
    if (shopIndex !== -1) {
      database.shops[shopIndex] = {
        id: req.params.id,
        name: req.body.name,
        items: database.shops[shopIndex].items, // Retaining existing items
        // Other updated shop details as per the schema
      };
      saveDatabase(database);
      res.json(database.shops[shopIndex]);
    } else {
      res.status(404).json({ message: "Shop not found" });
    }
  },

  deleteShop: (req, res) => {
    const database = getDatabase();
    const shopIndex = database.shops.findIndex(
      (shop) => shop.id === req.params.id
    );
    if (shopIndex !== -1) {
      const deletedShop = database.shops.splice(shopIndex, 1);
      saveDatabase(database);
      res.json({ message: "Shop deleted", deletedShop });
    } else {
      res.status(404).json({ message: "Shop not found" });
    }
  },
};

module.exports = shopController;
