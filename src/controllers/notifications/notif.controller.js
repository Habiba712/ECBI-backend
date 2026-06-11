
const Notification = require('../../models/notif.model');
const notifController = {};

notifController.getByReceipient = async (req, res) => {
    try{
        const userId = req.params.userId;
        const notifs = await Notification.find({ sender: userId }).populate('sender');
        res.status(200).json(notifs);

    }catch(err){
        console.err('Error fetching notifications: ', err);
        res.status(400).json({ message: 'Error fetching notifications' });
    }
}

notifController.createNotification = async (req, res) => {

    // i need the id of the user who will receive the notification
    // plus the id of the one who sent it 
    // plus the message
    // the noification is gonna be created the moment a post is poster by the user B.

    try {
        const { recipientId, senderId, message } = req.body;
        console.log('recipientId', recipientId, 'senderId', senderId, 'message', message);
        const notif = new Notification({
            recipient: recipientId,
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

notifController.markAsRead = async (req, res) => {
    try {
        const {notifId} = req.params;
        const Notif = await Notification.findByIdAndUpdate(
            notifId, 
            { "read": true }
        )
        if (!Notif){
            return res.status(404).json({ message: "Notification not found" });
        }
        await Notif.save();
        res.status(200).json(Notif);
    }
    catch (err) {
        console.error('Error marking notification as read: ', err);
        res.status(400).json({ message: 'Error marking notification as read' });
    }
}

notifController.deleteNotification = async (req, res) => {
    try {
        const { notifId } = req.params;
        const notif = await Notification.findByIdAndDelete(notifId);
        if (!notif) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json({ message: "Notification deleted successfully" });
    }
    catch (err) {
        console.error('Error deleting notification: ', err);
        res.status(400).json({ message: 'Error deleting notification' });
    }
}
module.exports = notifController;