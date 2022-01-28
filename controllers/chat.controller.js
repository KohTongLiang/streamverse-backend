const userService = require('../services/user.service')
const chatService = require('../services/chat.service');

const createThread = async (req, res) => {
    let primaryUsername = req.body.playerEmail;
    let groupId = req.body.groupId;

    let response = await chatService.createThread(primaryUsername, primaryUsername + "'s game'", groupId);

    if (response) res.status(200).json(response);
    else res.status(400).json({ "message" : "Failed to create chat. "});
}

const addUserToThread = async (req, res) => {
    res.status(501).send()
}

const updateGroupId = async (req, res) => {
    let threadId = req.body.threadId;
    let groupId = req.body.groupId;

    let response = await chatService.updateGroupId(threadId, groupId);
    res.status(200).json(response);
}

const findChat = async (req,res) => {
    let player = req.body.playerEmail;
    let response = await chatService.findChat(player);

    if (response) res.status(200).json(response);
    else res.status(400).json({ "Message" : "Request to server failed." })
}

const endChat = async (req, res) => {
    let threadId = req.body.threadId;
    let response = await chatService.endChat(threadId);

    res.status(200).json(response)
}

exports.createThread = createThread;
exports.addUserToThread = addUserToThread;
exports.updateGroupId = updateGroupId;
exports.findChat = findChat;
exports.endChat = endChat;