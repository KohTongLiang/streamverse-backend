const ChatClient = require("@azure/communication-chat").ChatClient;
const CommunicationUserCredential = require("@azure/communication-common").AzureCommunicationTokenCredential;
const axios = require("axios");
const config = require("../config.json");
const userService = require("./user.service");
const spoolService = require('./spool.service');
const threadService = require('./thread.service');
const dbClient = require("../db/index");

// initialize chat client and
// return a thread after provisioning
// return a thread if already exists between
// the given two pair of users
const createThread = async (playerUser1, threadName, groupId) => {
  try {
    let sender = await userService.findUser(playerUser1);
    // let receiver = await userService.findUser(playerUser2);

    var db = dbClient.getDB();
    let threads = await db.collection("Threads").find({}).toArray();

    if (threads != undefined && threads.length > 0) {
      // check if thread exists
      let thread = threads.find(
        (thread) =>
          thread.participants.find((member) => member.id.communicationUserId === sender.spoolID) !=
          undefined
      );

      if (thread != undefined) {
        return thread;
      }
    }

    //console.log("creating new thread...");
    let threadRequest = {
      topic: threadName
    };

    let threadOptions = {
      // topic: threadName,
      // isStickyThread: false,
      participants: [
        {
          id: {
            communicationUserId: await spoolService.getSpoolID(playerUser1, 'Player1')
          },
          displayName: sender.name 
        },
      ],
      groupId: groupId,
    };
    let endpointUrl = config.endpoint;

    // actual call to create the thread
    // console.log("initializing chat client...");
    console.log(sender.spoolToken);
    let chatClient = new ChatClient(endpointUrl, new CommunicationUserCredential(sender.spoolToken));

    // console.log("creating thread...");
    try {
      console.log("here abctc")
      let chatThread = await chatClient.createChatThread(threadRequest, threadOptions);
      //console.log('chat thread created: ');
      //console.log(chatThread);
      threadOptions.threadId = chatThread.chatThread.id;
      await db.collection("Threads").insertOne(threadOptions);
      return { "threadId": threadOptions.threadId };
    } catch (e) {
      console.log(e);
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const updateGroupId = async(threadId, groupId) => {
  try {
    var db = dbClient.getDB();
    let results = await threadService.updateGroupLocator(threadId, groupId);

    if (results) {
      return { "message" : groupId }
    } else {
      return { "message" : "Failed to update group id." }
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

// find available games and get group id to join
const findChat = async (playerEmail) => {
  try {
    var db = dbClient.getDB();
    let threads = await db.collection("Threads").find({}).toArray();
    let player = await userService.findUser(playerEmail);

    if (threads != undefined && threads.length > 0 && player != null) {
      let threads = await db.collection("Threads").find({}).toArray();

      if (threads != undefined && threads.length > 0) {
        // check if thread exists
        let thread = threads.find(
          (thread) =>
            thread.participants.length < 2
        );

        if (thread != undefined && thread != null) {
          let opponentId = thread.participants[0].id.communicationUserId;
          thread.participants.push({
              "id" : { "communicationUserId": player.spoolID },
              "displayName": player.name
            })
  
          db.collection("Threads").update({ _id: thread._id }, thread, (err, result) => {
            if (err) console.log(err)
          });

          return { "threadId" : thread.threadId, "groupId": thread.groupId, "opponentId": opponentId }
        } else {
          console.log('No threads available. Created new thread ')
          return { "groupId" : null };
        }
      }
    } else {
      // let resp =  createThread(playerEmail, player + "'s Game");
      return { "groupId" : null };
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

const endChat = async (threadId) => {
  try {
    var db = dbClient.getDB();
    await db.collection("Threads").deleteOne({ threadId: threadId }, (err, result) => {
      if (err !== null) console.log(err);

      return { "message" : "Succesfully end chat." }
    });
    
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

// intialize a chat
// add second user to the thread
// return acknowledgment
const addUserToThread = (adminUsername, token, usernameToAdd, threadId) => { };

exports.createThread = createThread;
exports.addUserToThread = addUserToThread;
exports.updateGroupId = updateGroupId;
exports.findChat = findChat;
exports.endChat = endChat;
