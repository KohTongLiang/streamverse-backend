const dbClient = require('../db/index')
const initData = require('./init.json')

const initializeDB = async () => {
    var db = dbClient.getDB()
    
    var players = initData.Players;
    var gamestates = initData.Gamestates;
    
    // adding slots to all the doctors
    // players.forEach(player => {
    //     player.slots.push(...generateSlots())
    // })

    try {
        console.log('adding new players collection')
        await db.collection("Players").insertMany(players)
        console.log('added playersers')

        console.log('adding new gamestates collection')
        await db.collection("Gamestates").insertMany(gamestates)
        console.log('added gamestates')

        console.log('Database initialization completed successfully.')
    } catch (e) {
        console.log(e)
    }
}

const SLOTS_PER_DAY = 5;

const generateSlots = () => {
    var slots = []
    var today = new Date()
    var startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30)

    var slotId = 0;

    // generate slots for upcoming 
    // three days including today
    for (var j = 1; j <= 3; j++) {
        for (var i = 0; i < SLOTS_PER_DAY; i++) {
            slots.push({
                id: ++slotId,
                startTime: startTime,
                endTime: new Date(startTime.getTime() + 30 /*minutes*/ * 60 * 1000),
                /* randomly mark the slots as occupied */
                occupied: ((Math.random() * 10) <= 3) ? true : false
            })
    
            // increment by an hour
            startTime = new Date(startTime.getTime() + 60 /*minutes*/ * 60 * 1000);
        }

        // reinitialize the date
        startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30)

        // add days
        startTime = new Date(startTime.getTime() + j /*days*/ * 24 * 60 * 60 * 1000)
    }

    return slots
}

exports.initializeDB = initializeDB