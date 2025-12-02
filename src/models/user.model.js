const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const hashPass = async (password) => {
    return bcrypt.hash(password, 10);
};

const BaseUserSchema = mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
 username: {
        type: String,
        lowercase: true
    },

    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [false, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    telephone: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now,
        required: false
    },
    role: {
        type: String,
        enum: ['SUPER_ADMIN', 'SOUS_ADMIN', 'FINAL_USER', "RESTO_SUPER_ADMIN", "RESTO_SOUS_ADMIN"],
        default: 'FINAL_USER'
    },

    resetPasswordToken: {
        type: String
    },


    resetPasswordExpires: {
        type: Date
    },

    activationCode: {
        type: String
    },

    activationCodeExpires: {
        type: Date
    },

    enabled: {
        type: Boolean,
        default: false
    },
    subscription: {
        plan: { type: String, enum: ['basic', 'premium'], default: 'basic' },
        status: String,
        expiresAt: Date,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
})

const FinalUserSchema = mongoose.Schema({
points: {
        type: Number,
        required: false,
        default: 0
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: false
    }],
    totalVisits: {
        type: Number,
        required: false,
        default: 0
    },
    visits:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PointOfSale',
            required: false,
            default: []
        }
    ],
    // we might not even need the totel visits, we can just use the length of visits
    totalReviews: {
        type: Number,
        required: false,
        default: 0
    },
    verified: {
        type: Boolean,
        required: false,
        default: true
    },
    visitHistory: [{
        pointOfSaleId: mongoose.Schema.Types.ObjectId,
        pointOfSaleName: String,
        date: Date,
        pointsEarned: Number
    }],
     preferences: {
        favoriteCuisines: {
            type: [String],
            default: []
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
})

const OwnerInfoSchema = mongoose.Schema({
    businessName: String,

    ownedPos: [
        { type: mongoose.Schema.Types.ObjectId,
        ref: 'PointOfSale',
        required: false
     }],

    totalRestaurants: { type: Number, default: 0 },
// we dont need tjis one, we can just use the lenth of ownedPos
    totalVisitsAllRestaurants: {
        type: Number,
        required: false,
        default: 0
    },
// this filed would rather be in the pos schema, the owner does have to have totalvivtis
    totalReviewsAllRestaurants: {
        type: Number,
        required: false,
        default: 0
    },
    averageRatingAllRestaurants: {
        type: Number,
        required: false,
        default: 0
    },

    settings: {
        reviews_notifications: {
            type: Boolean,
            default: true
        },
        visits_notifications: {
            type: Boolean,
            default: true
        },
        weekly_report: {
            type: Boolean,
            default: true
        }
    },

})

const SecuritySchema = new mongoose.Schema({
  resetToken: String,
  resetTokenExpiry: Date,
  emailVerificationToken: String,
  emailVerified: { type: Boolean, default: false }
});

const UserSchema = mongoose.Schema({
   base: BaseUserSchema,
   finalUser: FinalUserSchema,
   ownerInfo: OwnerInfoSchema,
   security: SecuritySchema
  
});

// Hash le mot de passe avant de sauvegarder l'utilisateur
UserSchema.pre('save', async function (next) {
    try {
        if ((this.base.password).isModified || this.isNew) {
            const ifAlreadyHashed = /^\$2[ayb]\$.{56}$/.test(this.base.password);

            if (!ifAlreadyHashed) {
                this.base.password = await hashPass(this.base.password)
            }
            next();

        }
    } catch (err) {
        next(err)
    }

})


UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour activer l'utilisateur
UserSchema.methods.activate = async function () {
    this.enabled = true;
    return this.save();
};

// Exclure les champs sensibles de la réponse JSON
// UserSchema.methods.toJSON = function () {
//     const userObject = this.toObject();
//     delete userObject.password;
//     delete userObject.resetPasswordExpires;
//     delete userObject.resetPasswordToken;
//     delete userObject.activationCode;
//     delete userObject.activationCodeExpires;
//     return userObject;
// };

// Gérer les erreurs de duplication d'email
// UserSchema.post('save', function (error, doc, next) {
//     if (error.name === 'MongoError' && error.code === 11000) {
//         const item = error.message.split(':')[2].split(' ')[1].split('_')[0]; 
//         let message = 'Duplicate email';
//         let code = undefined;

//         if (item === 'email') {
//             code = 'USER_AUTH_DUPLICATE_EMAIL';
//         }

//         let err = new Error(message);
//         if (code) {
//             err = new Error(JSON.stringify({ message, code_error: code }));
//         }
//         next(err);
//     } else {
//         next(error);
//     }
// });

const User = mongoose.model('User', UserSchema);

module.exports = User;
