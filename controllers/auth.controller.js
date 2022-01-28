const bycript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const userService = require('../services/user.service');
const { CommunicationIdentityClient } = require('@azure/communication-identity')
const dbClient = require('../db/index')

const login = async (req, res) => {
    // get email and password from POST body
    const { email, password } = req.body;

    // find existing user
    var userIdentity = await userService.getUser(email, password)

    if (userIdentity !== undefined && userIdentity !== null && userIdentity !== false) {
        var token = jwt.sign({ email: email, userType: 'Players' }, config.jwtPrivateKey, { expiresIn: '1h' });
        
        let tokenResponse = await getTokenResponse(userIdentity)

        // update the users list
        await userService.updateSpoolID(tokenResponse.communicationUserId, tokenResponse.token, email)
        res.status(200).json({
            email: email,
            token: token,
            name: userIdentity.name,
            spoolID: tokenResponse.communicationUserId,
            spoolToken: tokenResponse.token,
            userType: 'Player'
        });
    }
    else {
        res.status(401).json({ message: "Invalid User "});
    }
}

const signUp = async (req, res) => {
    const { email, password, name, ethnicity, gender, age, nationality, languages, hobbies } = req.body;
    const player = {
        "email": email,
        "password": password,
        "name": name,
        "ethnicity": ethnicity,
        "gender": gender,
        "age": age,
        "nationality": nationality,
        "languages": languages,
        "hobbies": hobbies
    }

    let result = userService.createUser(player);
    if (result) {
        var userIdentity = await userService.getUser(email, password)
        var token = jwt.sign({ email: email, userType: 'Players' }, config.jwtPrivateKey, { expiresIn: '24h' });
        
        let tokenResponse = await getTokenResponse(userIdentity)

        // update the users list
        await userService.updateSpoolID(tokenResponse.communicationUserId, tokenResponse.token, email)
        res.status(200).json({
            email: email,
            token: token,
            name: userIdentity.name,
            spoolID: tokenResponse.communicationUserId,
            spoolToken: tokenResponse.token,
            userType: 'Player'
        });
    } else {
        res.status(400).json({ "message": "Unsuccessfully registered account." });
    }
}

const getTokenResponse = async (userIdentity) => {
    // generate the spool id and token
    const identityClient = new CommunicationIdentityClient(config.connectionString)
    let tokenResponse = undefined;
    if (userIdentity !== undefined && userIdentity.user !== undefined && userIdentity.user.communicationUserId != undefined && userIdentity.user.communicationUserId != "") {
        console.log("just updating token as user already exists...");
        tokenResponse = await identityClient.getToken({ communicationUserId: userIdentity.user.communicationUserId }, ["voip", "chat"]);
        console.log(tokenResponse);
        return {
            "communicationUserId": userIdentity.user.communicationUserId,
            ...tokenResponse
        };
    }
    else {
        let userResponse = await identityClient.createUser();
        tokenResponse = await identityClient.getToken(userResponse, ["voip", "chat"]);
        console.log(tokenResponse)
        return {
            "communicationUserId": userResponse.communicationUserId,
            ...tokenResponse
        }
    }
}

exports.login = login;
exports.signUp = signUp;