var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var ObjectId = require("mongodb").ObjectID;
var conf = require("../config.json");

const dbClient = require("../db/index");
const e = require("express");

const getUser = async (email, password) => {
  var db = dbClient.getDB();
  try {
    var user = await db.collection("Players").findOne({ email: email, password: password });
    return user;
  }
  catch (e) {
    return false;
  }
}

const findUser = async (email) => {
  var db = dbClient.getDB();
  try {
    var user = await db.collection("Players").findOne({ email: email });
    return user;
  }
  catch (e) {
    return false;
  }
}

const getUsers = async () => {
  var db = dbClient.getDB();
  try {
    var users = await db
      .collection("Players")
      .find({}).toArray();
    return users;
  } catch (e) {
    return undefined;
  }
};

const createUser = async (player) => {
  var db = dbClient.getDB();

  try {
    await db.collection("Players").insertOne(player, (err, result) => {
      if (err) return false;
      return true;
    })
  } catch (e) {
    console.log(e);
    return false;
  }
}

const updateSpoolID = async (spoolID, spoolToken, email) => {
  var db = dbClient.getDB();
  try {
    var newValues = { $set: { spoolID: spoolID, spoolToken: spoolToken }}
    var response = await db.collection("Players").updateOne({ email: email }, newValues);
    console.log("user updated with spoolid and spool token...");
    console.log('spoolID: ' + spoolID);
    console.log('spoolToken: ' + spoolToken)
    return true
  }
  catch (e) {
    console.log(e);
    return false
  }
};

exports.getUser = getUser;
exports.findUser = findUser;
exports.getUsers = getUsers;
exports.updateSpoolID = updateSpoolID;
exports.createUser = createUser;