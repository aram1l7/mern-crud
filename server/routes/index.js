const express = require("express");
const router = express.Router();
const User = require("../models/User");

function routes() {
  router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  });

  router.post("/create", async (req, res) => {
    const { name, email, phone, address, surname } = req.body;
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({
        errors: [
          {
            msg: "Invalid email",
          },
        ],
      });
    }

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: "User already exists" }],
        });
      }
      user = new User({
        name,
        email,
        phone,
        address,
        surname,
      });
      await user.save();
      res.status(200).json({ user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  router.put("/edit/:id", async (req, res) => {
    try {
      const userFields = {};
      Object.keys(req.body).forEach((key) => {
        if (req.body[key]) {
          switch (key) {
            case "name":
            case "surname":
            case "email":
            case "address":
            case "phone":
              userFields[key] = req.body[key];
              break;
            default:
              return userFields;
          }
        }
      });
      let user = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: userFields,
        }
      );
      await user.save();
      let users = await User.find();
      res.json({ users });
    } catch (error) {
      console.error(error.message);
      if (error.kind == "ObjectId") {
        return res.status(400).json({ msg: "User not found" });
      }
      res.status(500).send("Internal server error");
    }
  });

  router.delete("/delete/:id", async (req, res) => {
    try {
      await User.findOneAndRemove({ _id: req.params.id });
      res.json({ msg: "User is successfully deleted" });
    } catch (error) {
      console.error(error.message);
      if (error.kind == "ObjectId") {
        return res.status(400).json({ msg: "User not found" });
      }
      res.status(500).send("Internal server error");
    }
  });

  return router;
}

module.exports = routes;
