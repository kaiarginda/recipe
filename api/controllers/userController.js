const User = require("../models/User");
const Recipe = require("../models/Recipe");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Image = require("../models/Image");
const Comment = require("../models/Comments");
//

//

//

//

//
exports.getAllUser = async (req, res) => {
  console.log("get all users");
};

// Example: Create a new item
exports.createUser = async (req, res) => {
  const saltRounds = 10;
  let hashedPassword = "";
  let { username, password } = req.body;

  const exists = await User.findOne({ name: username });
  if (exists) return res.json({ status: "bad", exists });
  if (!username || !password) {
    return res.json("not enought details given.");
  }
  await bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      console.log("Salt: ", salt);
      return bcrypt.hash(password, salt);
      // bcrypt.hash(password, salt);
    })
    .then((hash) => {
      console.log("Hash: ", hash);
      hashedPassword = hash;
    })
    .catch((err) => console.error(err.message));

  try {
    if (hashedPassword) {
      const user = await User.create({
        name: username,
        password: hashedPassword,
      });
      return res.json("user creation succeed");
    } else {
      console.log("user created failed fr");

      return res.json("User creation failed");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const secretKey =
    "adsfasdfsadkfmsdkfmskadnfsadfsadf...//*******!@31312312312sdfshhhhsgfsadfafasfxc..,asdf;sda[fsd[fs;da;j;;d,//142352***#!$]]";

  try {
    const user = await User.findOne({ name: username });

    if (!user) {
      return res.json({ status: "bad" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json("Invalid password");
    }

    const token = jwt.sign({ user }, secretKey);
    // console.log(token, "token to be signed");
    res.cookie("token", token, {});
    return res.json("sucess");
    // return;
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.users = async (req, res) => {
  const bearerHeader = req.headers["authorization"];
  // console.log("trying but struggling.");
  if (!bearerHeader) {
    return res.status(401).json({ error: "Unauthorized - Token not provided" });
  }
  const token = bearerHeader.split(" ")[1];
  // console.log(token, "got the token ye");
  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Invalid token format" });
  }

  const secretKey =
    "adsfasdfsadkfmsdkfmskadnfsadfsadf...//*******!@31312312312sdfshhhhsgfsadfafasfxc..,asdf;sda[fsd[fs;da;j;;d,//142352***#!$]]";

  const decoded = jwt.verify(token, secretKey);
  // console.log(decoded, "token frfrfrfrfrfr");
  if (!decoded) return;
  const loggedName = decoded.user.name;
  const { name } = req.body; // Retrieve name from the request body
  const user = await User.findOne({ name });

  let follows = false;

  // if (user.followers.includes({ name: loggedName })) {
  //   follows = true;
  // }

  // console.log(user.followers, loggedName);
  // console.log(follows, "follows or not.");
  const followerExists = user.followers.some(
    (follower) => follower.name === loggedName
  );

  if (followerExists) {
    follows = true;
  }

  console.log(user.followers, loggedName);
  console.log(follows, "follows or not.");
  return res.json({ loggedUser: decoded.user, follows, user });
};

exports.recipes = async (req, res) => {
  const recipe = await Recipe.find();
  // console.log(recipe);
  return res.json(recipe);
};

exports.recipeItem = async (req, res) => {
  const { recipeId } = req.body;
  const recipe = await Recipe.findOne({ _id: recipeId });
  return res.json(recipe);
};

exports.createRecipe = async (req, res) => {
  const { name, ingredients, description } = req.body;
  const image = req.file.filename;
  // console.log(name, ingredients, image, description);

  await Recipe.create({
    ingredients: ingredients.split(","),
    description,
    image,
    title: name,
  });
  return res.json("fenomenal");
};

exports.uploadImage = async (req, res) => {
  const imageName = req.file;
  try {
    await Image.create({ image: imageName });
    res.json("okey");
    return;
  } catch (err) {
    console.log(err.message);
    return;
  }
};

exports.reply = async (req, res) => {
  const body = req.body;
  // console.log(body, "from fucking reply");
  await Comment.create({
    text: body.reply,
    parentId: body.parentId,
    productId: body.productId,
    author: body.author,
  });
};
exports.comments = async (req, res) => {
  const body = req.body;
  await Comment.create({
    text: body.comment,
    productId: body.postID,
    parentId: body.parentId,
    root: body.onroot,
    author: body.author,
  });

  return new Response("adf");
};

exports.commentList = async (req, res) => {
  const comments = await Comment.find({ root: "root" });
  const allComments = await Comment.find();

  let user = null; // Initialize user as null

  return res.json({ comments, allComments });
  // if (token) {
  //   user = verify(token.value, "secret");
  // }
};

exports.user = async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ name: body.name });
  if (!user) {
    console.log("no user exists");
    return res.json({ user: {} });
  }
  return res.json({ user });
};

exports.getFollowers = async (req, res) => {
  const user = await User.findOne({ name: req.body.name });

  return res.json({ followers: user.followers });
};
exports.getFollowing = async (req, res) => {
  const user = await User.findOne({ name: req.body.name });

  return res.json({ following: user.following });
};

exports.follow = async (req, res) => {
  const { user, loggedName } = req.body;

  const updatedUser = await User.findOneAndUpdate(
    { name: user.name },
    {
      followers: [...user.followers, { name: loggedName }],
    }
  );

  const newUser = await User.findOne({ name: loggedName });
  await User.findOneAndUpdate(
    { name: loggedName },
    {
      following: [...newUser.following, { name: user.name }],
    }
  );
  return res.json({ user });
};

exports.unfollow = async (req, res) => {
  const { user, loggedName } = req.body;

  // Find the index of the follower with the given name
  const followerIndex = user.followers.findIndex(
    (follower) => follower.name === loggedName
  );

  const loggedUser = await User.findOne({ name: loggedName });
  console.log(loggedUser, "loggeduser");
  const loggedFollowing = loggedUser.following;
  console.log(loggedFollowing, "loggedFollowing");
  const followingIndex = loggedFollowing.findIndex(
    (following) => following.name === user.name
  );
  console.log(followingIndex);
  if (followingIndex !== -1) {
    const updatedFollowings = [
      ...loggedFollowing.slice(0, followingIndex),
      ...loggedFollowing.slice(followingIndex + 1),
    ];

    console.log(updatedFollowings);
    const updatedLoggedUser = await User.findOneAndUpdate(
      { name: loggedName },
      { following: updatedFollowings },
      { new: true } // This option ensures that the updated document is returned
    );
  }
  // Check if the follower is found
  if (followerIndex !== -1) {
    // Create a new array without the follower to be removed
    const updatedFollowers = [
      ...user.followers.slice(0, followerIndex),
      ...user.followers.slice(followerIndex + 1),
    ];

    // Update the user document in the database
    const updatedUser = await User.findOneAndUpdate(
      { name: user.name },
      { followers: updatedFollowers },
      { new: true } // This option ensures that the updated document is returned
    );

    return res.json({ user: updatedUser });
  } else {
    return res.status(404).json({ error: "Follower not found" });
  }
};

exports.follows = async (req, res) => {
  const { user, loggedUser } = req.body;
  // if (user.followers.includes({ name: loggedUser.name })) return true;
  // return false;

  if (!user || !loggedUser) return;
  console.log(user, "for real wtf is wrong with you");
  if (!user.followers) return;
  if (user.followers.includes(loggedUser.name)) {
    console.log("following,");
    return true;
  }
  console.log(" not following,");

  return false;
};

exports.loggedUser = async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Invalid token format" });
  }

  const secretKey =
    "adsfasdfsadkfmsdkfmskadnfsadfsadf...//*******!@31312312312sdfshhhhsgfsadfafasfxc..,asdf;sda[fsd[fs;da;j;;d,//142352***#!$]]";

  try {
    const decoded = jwt.verify(token, secretKey);
    return res.json({ user: decoded.user });
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

exports.updateFavourites = async (req, res) => {
  const { user, favourites } = req.body;
  console.log(user.name);
  await User.findOneAndUpdate(
    { name: user.name },
    {
      favourites,
    }
  );

  return res.json("asdf");
};
exports.getFavourites = async (req, res) => {
  // const { name } = req.body;
  // const user = await User.findOne({ name });

  // return res.json({ favourites: user.favourites });
  const token = req.body.token;
  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Invalid token format" });
  }

  const secretKey =
    "adsfasdfsadkfmsdkfmskadnfsadfsadf...//*******!@31312312312sdfshhhhsgfsadfafasfxc..,asdf;sda[fsd[fs;da;j;;d,//142352***#!$]]";

  try {
    const decoded = jwt.verify(token, secretKey);
    const name = decoded.user.name;
    const user = await User.findOne({ name });

    return res.json({ favourites: user.favourites, loggedUser: user });
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

exports.getOtherFavourites = async (req, res) => {
  try {
    const name = req.body.name;
    const user = await User.findOne({ name });

    // Use Promise.all to wait for all async operations to complete
    const favs = await Promise.all(
      user.favourites.map(async (item) => {
        const recipe = await Recipe.findOne({ _id: item });
        // console.log(recipe);
        return recipe; // Return the recipe to be added to the result array
      })
    );

    // console.log(favs);
    return res.json({ favourites: favs });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
