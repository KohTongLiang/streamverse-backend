const userService = require('../services/user.service')
const chatService = require('../services/chat.service');

const createThread = async (req, res) => {
    let primaryUsername = req.body.playerEmail;
    let groupId = req.body.groupId.groupId;

    let response = await chatService.createThread(primaryUsername, primaryUsername + "'s game'", groupId);
    res.status(200).json(response);
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
    res.status(200).json(response);
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