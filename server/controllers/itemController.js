const fs = require("fs");

const getDatabase = () => {
  const data = fs.readFileSync("./data/database.json");
  return JSON.parse(data);
};

const saveDatabase = (data) => {
  const existingData = getDatabase();
  const newData = { ...existingData, ...data }; // Merge existing and updated data
  fs.writeFileSync("./data/database.json", JSON.stringify(newData, null, 2));
};

const itemsController = {
  getAllItems: (req, res) => {
    const { shopId } = req.params;
    const { shops } = getDatabase();
    const shop = shops.find((shop) => shop.id === shopId);

    if (shop) {
      res.json(shop.items);
    } else {
      res.status(404).json({ message: "Shop not found" });
    }
  },

  getItemById: (req, res) => {
    const { shopId, itemId } = req.params;
    const { shops } = getDatabase();
    const shop = shops.find((shop) => shop.id === shopId);

    if (shop) {
      const item = shop.items.find((item) => item.itemId === itemId);
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ message: "Item not found in the shop" });
      }
    } else {
      res.status(404).json({ message: "Shop not found" });
    }
  },

  createItem: (req, res) => {
    const { shopId } = req.params;
    const { itemId, name, price, quantity } = req.body;
    const database = getDatabase();
    const shopIndex = database.shops.findIndex((shop) => shop.id === shopId);

    if (shopIndex !== -1) {
      const newItem = { itemId, name, price, quantity };
      database.shops[shopIndex].items.push(newItem);
      saveDatabase(database);
      res.status(201).json(newItem);
    } else {
      res.status(404).json({ message: "Shop not found" });
    }
  },

  updateItem: (req, res) => {
    const { shopId, itemId } = req.params;
    const { name, price, quantity } = req.body;
    const database = getDatabase();
    const shopIndex = database.shops.findIndex((shop) => shop.id === shopId);

    if (shopIndex !== -1) {
      const itemIndex = database.shops[shopIndex].items.findIndex(
        (item) => item.itemId === itemId
      );
      if (itemIndex !== -1) {
        database.shops[shopIndex].items[itemIndex] = {
          itemId,
          name: name || database.shops[shopIndex].items[itemIndex].name,
          price: price || database.shops[shopIndex].items[itemIndex].price,
          quantity:
            quantity || database.shops[shopIndex].items[itemIndex].quantity,
        };
        saveDatabase(database);
        res.json(database.shops[shopIndex].items[itemIndex]);
      } else {
        res.status(404).json({ message: "Item not found in the shop" });
      }
    } else {
      res.status(404).json({ message: "Shop not found" });
    }
  },

  deleteItem: (req, res) => {
    const { shopId, itemId } = req.params;
    const database = getDatabase();
    const shopIndex = database.shops.findIndex((shop) => shop.id === shopId);

    if (shopIndex !== -1) {
      const itemIndex = database.shops[shopIndex].items.findIndex(
        (item) => item.itemId === itemId
      );
      if (itemIndex !== -1) {
        const deletedItem = database.shops[shopIndex].items.splice(
          itemIndex,
          1
        );
        saveDatabase(database);
        res.json({ message: "Item deleted", deletedItem });
      } else {
        res.status(404).json({ message: "Item not found in the shop" });
      }
    } else {
      res.status(404).json({ message: "Shop not found" });
    }
  },
};

module.exports = itemsController;
