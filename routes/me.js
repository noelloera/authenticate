const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mongoose = require("mongoose");

const { User, List, Item } = require("../database/models/User.js");

//OBTAINS USER INFORMATION FROM DATABASE
router.get("/me", auth, async (req, res) => {
  //Esentially you can now just use the auth middleware to auth every call made using that token (GET, PUT, POST)
  try {
    if (req.body.id) {
      const user = await User.findById(req.body.id);
      //You can use this to return only specific items form the DB
      res.status(200).send({
        username: user.username,
        lists: user.lists,
      });
    } else {
      res.status(401).send({ message: "error in fetching user" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "error in fetching user" });
  }
});

router.get("/lists/", auth, (req, res) => {
  //Later, should only send if the log in was successful
  User.findById(req.body.id, (error, user) => {
    if (error) {
      res.status(500).send({
        message: "unable to retrieve objects",
        error: error,
      });
    } else {
      res.status(200).send({
        message: "found objects",
        lists: user.lists,
      });
    }
  });
});

//GET ID
router.get("/lists/:listId", auth, (req, res) => {
  const id = req.params.listId;
  if (id && id !== "") {
    User.findOne(
      //Returning the entire pre document in the query
      {_id:req.body.id, "lists._id":id},
      {"lists.$":id},
      (error, log) => {
        if (error ) {
          res.status(404).send({
            message: "unable to retrieve list",
          });
        } else {
          res.status(302).send({
            message: "successfully retrieved list",
            list: log,
          });
        }
      }
    );
  } else {
    res.status(404).send({
      message: "unable to retrieve list: invalid id",
    });
  }
});

//POST Requests
//Lists
router.post("/lists/", auth, (req, res) => {
  const name = req.body.name;
  if (name && name !== "" && name.replace(/\s/g, '').length) {
    //connections should be established after conditionals
    const newList = new List({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      items: [],
    });
    User.updateOne(
      { _id: req.body.id },
      { $push: { lists: newList } },
      (error, log) => {
        if (error || !log) {
          res.status(422).send({
            message: "unable to create: invalid list name",
          });
        } else {
          res.status(201).send({
            message: "successully created list",
            log: log
          });
        }
      }
    );
  } else {
    res.status(422).send({
      message: "unable to create: invalid list name",
    });
  }
});

//Post Items
router.post("/lists/:listId", auth, (req, res) => {
  const id = req.params.listId;
  const value = req.body.value;
  if (value && value !== "" && value.replace(/\s/g, '').length) {
    const newItem = Item({
      _id: new mongoose.Types.ObjectId(),
      value: value,
    });
    User.updateOne(
      //Upsert allows it to update and insert to given id params
      { _id: req.body.id, "lists._id": id },
      { $push: { "lists.$.items": newItem } },
      (error, log) => {
        if (error) res.status(404).send(error);
        else
          res.status(201).send({
            message: "updated",
            log: log
          });
      }
    );
  } else {
    res.status(422).send({ message: "unable to create: invalid item name" });
  }
});

//UPDATE Item and List Names

//DELETE Requests, you can send the body as url call too
router.delete("/lists/:listId", auth, (req, res) => {
  const listId = req.params.listId;
  const itemId = req.body.itemId;
  if (itemId && listId) {
    User.updateOne(
      { _id: req.body.id, "lists._id": listId, "lists.items._id": itemId },
      { $pull: { "lists.$.items": { "_id": itemId } } },
      (error, log) => {
        if (error) {
          res.status(422).send({
            message: "unable to delete: request error",
          });
        } else {
          res.status(202).send({
            message: "deleted the item object",
            log: log
          });
        }
      }
    );
  } else {
    res.status(404).send({
      message: "unable to delete object with that id",
    });
  }
});

module.exports = router;
