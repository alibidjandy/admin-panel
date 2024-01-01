const fs = require("fs");
const jwt = require("jsonwebtoken");

const jwtSecretKey = "YourSecretKeyShouldBeLongAndRandom"; // Replace with your actual secret key

const getDatabase = () => {
  const data = fs.readFileSync("./data/database.json");
  return JSON.parse(data);
};

// const saveDatabase = (data) => {
//   const existingData = getDatabase();
//   const newData = { ...existingData, ...data }; // Merge existing and updated data
//   fs.writeFileSync("./data/database.json", JSON.stringify(newData, null, 2));
// };

const login = (req, res) => {
  const { email, password } = req.body;
  const database = getDatabase();

  // Find the user with the provided username
  const user = database.users.find((user) => user.email === email);

  // If the user exists, check if the password matches
  if (user) {
    if (user.password === password) {
      // Password matches - generate a JWT token for authentication
      const token = jwt.sign({ email: user.email }, jwtSecretKey, {
        expiresIn: "24h",
      });
      res.json({ token, email: user.email });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } else {
    res.status(401).json({ message: "User not found" });
  }
};

module.exports = {
  login,
};
