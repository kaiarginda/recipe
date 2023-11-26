// routes/itemRoutes.js

const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const Image = require("../models/Image");

router.post("/register", userController.createUser);
router.post("/login", userController.login);
//
router.post("/users", userController.users);
//

router.get("/recipes", userController.recipes);
router.post("/recipes/:title/:id", userController.recipeItem);
router.post("/reply", userController.reply);
router.post("/comment", userController.comments);
router.get("/commentList", userController.commentList);
router.post("/user", userController.user);
router.post("/follow", userController.follow);
router.post("/unfollow", userController.unfollow);
router.post("/follows", userController.follows);
router.post("/loggedUser", userController.loggedUser);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

//  dest: "images/",
const upload = multer({ storage: storage });

router.post(
  "/createRecipe",
  upload.single("image"),
  userController.createRecipe
);

router.get("/get-image", async (req, res) => {
  try {
    Image.find({}).then((data) => {
      res.send({ status: "ok", data });
    });
  } catch (error) {
    res.json({ status: error });
  }
});

router.post("/update-favourites", userController.updateFavourites);
router.post("/get-favourites", userController.getFavourites);

router.post("/get-other-favourites", userController.getOtherFavourites);

// Add more routes for other CRUD operations

module.exports = router;
