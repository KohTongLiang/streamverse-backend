var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var ObjectId = require("mongodb").ObjectID;
var conf = require("../config.json");

const dbClient = require("../db/index");
const e = require("express");

const updateGroupLocator = async (threadId, groupId) => {
    var db = dbClient.getDB();
    try {
      var newValues = { $set: { groupId: groupId }}
      var response = await db.collection("Threads").update({ threadId: threadId }, newValues);
      console.log("updated call group id...");
      return true
    } catch (e) {
      console.log(e);
      return false
    }
  };

exports.updateGroupLocator = updateGroupLocator;