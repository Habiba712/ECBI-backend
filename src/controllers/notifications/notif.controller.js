
const Notification = require('../../models/notif.model');
const notifController = {};

// notifController.getByReceipient = async (req, res) => {
//     try{
//         const userId = req.params.userId;
//         const notifs = await Notification.find({ recepient: userId });
//         res.status(200).json(notifs);

//     }catch(err){
//         console.err('Error fetching notifications: ', err);
//         res.status(400).json({ message: 'Error fetching notifications' });
//     }
// }

notifController.createNotification = async (req, res) => {

    // i need the id of the user who will receive the notification
    // plus the id of the one who sent it 
    // plus the message
    // the noification is gonna be created the moment a post is poster by the user B.

    try {
        const { recepientId, senderId, message } = req;

        const notif = new Notification({
            recepient: recepientId,
            sender: senderId,
            message: message
        });
        await notif.save();
        res.status(201).json(notif);
    }
    catch (err) {
        console.error('Error creating notification: ', err)
    }
}

module.exports = notifController;