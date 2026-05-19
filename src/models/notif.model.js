const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Scheme({

    recipient: {
        type: mongoose.Scheme.Types.ObjectId,
        ref: 'User',
        required: true
    },
     sender: {
        type: mongoose.Scheme.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
   
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
