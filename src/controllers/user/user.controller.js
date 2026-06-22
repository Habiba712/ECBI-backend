

const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const PointOfSale = require('../../models/pointOfSale.model');
const { z, ZodError } = require("zod");
const FileUpload = require('../../models/media.model'); // Import your mongoose model
const cloudinary = require('../../config/cloudinary');
const userController = {};

userController.createOwner = async (req, res, next) => {
    try {
        const {
            email,
            name,
            telephone,
            businessName,
            // pointOfSaleName,
            password

        } = req.body;
        console.log(email, name, password, telephone)

        const existingUser = await User.findOne({ "base.email": email });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists in the database" });

        }

        // const checkPointOfSale = await PointOfSale.findOne({ name: pointOfSaleName });
        // // console.log('point of sale',checkPointOfSale)
        // console.log('checkPointOfSale', checkPointOfSale.name)
        // if (!checkPointOfSale) {
        //     return res.status(400).json({ message: "Point Of Sale Doesn Not Exsist" })
        // }

        //check if the point of sale is already owned by ANOTHER user


        const newUser = new User({
            base: {
                email,
                name: name,
                telephone,
                role: "RESTO_SUPER_ADMIN",
                password: await bcrypt.hash(password, 10)

            },
            ownerInfo: {
                businessName
                // ownedPos: [checkPointOfSale._id],
            }
        })
        //   if (checkPointOfSale.ownerId !== null) {
        //             console.log("Point Of Sal Already Owned")
        //             return res.status(400).json({ message: "Point Of Sale Already Owned" });
        //         }
        //         else 
        // if(checkPointOfSale.ownerId === "" || checkPointOfSale.ownerId === undefined){
        //             const updatedPointOfSale = await PointOfSale.findByIdAndUpdate(checkPointOfSale._id, {
        //                 $set: {
        //                     ownerId: newUser._id
        //                 }
        //             });
        //         }
        await newUser.save();
        return res.status(201).json({ message: "User Created Successfully", user: newUser });
    } catch (err) {
        next(err)
    }
}
userController.updateOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const user = await User.findByIdAndUpdate(id, updateData);

        res.status(202).json({ message: 'User updated successfully', data: user });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        next(err)
    }
}
userController.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: 'Users found', data: users });

    } catch (err) {
        next(err)
    }
}


userController.register = async (req, res, next) => {

    console.log('are we here')
    try {
        const {
            name,
            email,
            username,
            password,
            telephone,
            avatar,
            role,
            points,
            preferences,
            visitHistory

        } = req.body;
        console.log(email, username, password, telephone, preferences)

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists in the database" });

        }

        // const checkPointOfSale = await PointOfSale.findOne({name: pointOfSaleName});

        // if(!checkPointOfSale){
        //     return res.status(400).json({message: "PointOf Sale Doesn Not Exsist"})
        // }
        let prefsToSave = {
            //   notifications: true,
            //   emailUpdates: true,
            favoriteCuisines: []
        };

        if (Array.isArray(preferences)) {
            prefsToSave.favoriteCuisines = preferences
        }
        const newUSer = new User({
            base: {
                name,
                email,
                username,
                telephone,
                avatar,
                role,
                password: await bcrypt.hash(password, 10)
            },
            finalUser: {
                points,
                preferences: prefsToSave,
                visitHistory: {
                    ...visitHistory
                },
            }
        })

        await newUSer.save();
        return res.status(201).json({ message: "User Created Successfully", user: newUSer });
    } catch (err) {
        next(err)
    }
}

userController.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { section, name, email, telephone, password, newPassword } = req.body;
        const targetSection = section || "base"; // Fallback safety catch
        const fieldsToUpdate = {};
        if (!password || password === "" || password === "undefined") {
            return res.status(400).json({ message: "Confirming your current password is required to save changes." });
        }
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const storedHashedPassword = existingUser[targetSection]?.password || existingUser.base?.password;

        const isPasswordCorrect = await bcrypt.compare(password, storedHashedPassword);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "The password you entered is incorrect. Authorization denied." });
        }

        if (newPassword && newPassword !== "" && newPassword !== "undefined") {
            console.log('🔐 New password string identified. Compiling cryptographic salt...');

            fieldsToUpdate[`${targetSection}.password`] = await bcrypt.hash(newPassword, 10);
        }
        let avatarUrl = null;

        // 2. Safely capture stream buffer updates from your file parser middleware (Multer)
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "users" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            avatarUrl = uploadResult.secure_url;
        }
        else {
            console.log('ℹ️ No new avatar file provided.');
        }



        if (name) fieldsToUpdate[`${targetSection}.name`] = name;
        if (email) fieldsToUpdate[`${targetSection}.email`] = email;
        if (telephone) fieldsToUpdate[`${targetSection}.telephone`] = telephone;
        if (avatarUrl) fieldsToUpdate[`${targetSection}.avatar`] = avatarUrl;



        // 4. Update the record within MongoDB matching your deep object path assignment
        const user = await User.findByIdAndUpdate(
            id,
            { $set: fieldsToUpdate },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        return res.status(200).json({ message: 'User updated successfully', 'password': password, 'newPassword': newPassword });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

userController.updateUserPoints = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { points, posId } = req.body;
        const pos_id = posId;
        console.log('updateUserPoints', id, points, posId)
        const user = await User.findById(id);
        
         if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }  
        console.log('uer.finalUSer', user.finalUser)
       const index = user.finalUser.pointsByPos.findIndex(p => p.posId == pos_id);
console.log('index', index)
       if(index !== -1 && index !== undefined){
        console.log('index', index)
        user.finalUser.pointsByPos[index].earnedPoints += points;
       }
       else{
        user.finalUser.pointsByPos.push({
            posId: posId,
            earnedPoints: points,
            redeemedPoints: 0
        })
       }
    await user.save();
        console.log(user?.finalUser?.pointsByPos)
       

        return res.status(200).json({ message: 'User updated successfully', data: user });

    } catch (err) {
        next(err)
    }
}

userController.updateProfileUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, telephone, password } = req.body;


        let avatarUrl = null;

        // 2. Safely capture stream buffer updates from your file parser middleware (Multer)
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "users" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            avatarUrl = uploadResult.secure_url;
        }
        console.log('uploadResult', uploadResult)
        const fieldsToUpdate = {};
        const targetSection = section || "base"; // Fallback safety catch

        if (name) fieldsToUpdate[`${targetSection}.name`] = name;
        if (email) fieldsToUpdate[`${targetSection}.email`] = email;
        if (telephone) fieldsToUpdate[`${targetSection}.telephone`] = telephone;
        if (avatarUrl) fieldsToUpdate[`${targetSection}.avatar`] = avatarUrl;

        // if (password) {
        //     fieldsToUpdate[`${targetSection}.password`] = await bcrypt.hash(password, 10);
        // }

        // 4. Update the record within MongoDB matching your deep object path assignment
        const user = await User.findByIdAndUpdate(
            id,
            { $set: fieldsToUpdate },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        return res.status(200).json({ message: 'User updated successfully', data: user });

    } catch (err) {

    }
}

userController.settingsUpdateById = async (req, res, next) => {
    // 1. Zod Schema allowing loose inputs and treating everything as structurally optional
    const settingsSchema = z.object({
        name: z.string().min(2).max(50).optional().or(z.literal("")),
        businessName: z.string().min(2).max(50).optional().or(z.literal("")),
        email: z.string().email("Invalid email address").optional().or(z.literal("")),
        telephone: z.string().regex(/^\+?\d{7,15}$/, "Invalid phone number").optional().or(z.literal("")),
        oldPassword: z.string().optional().or(z.literal("")),
        password: z.string().optional().or(z.literal("")),
        preferences: z.object({
            reviews_notifications: z.boolean().optional(),
            visits_notifications: z.boolean().optional(),
            weekly_report: z.boolean().optional(),
        }).optional(),
    });

    try {
        // Safe parameter safety guard to protect against undefined request bodies
        if (!req.body || !req.body.data) {
            return res.status(400).json({ message: "Request payload body wrapper 'data' is missing or undefined." });
        }

        const validateData = settingsSchema.parse(req.body.data);
        const { id } = req.params;

        // Clean up empty form properties so they don't overwrite database paths with blank values
        Object.keys(validateData).forEach(key => {
            if (validateData[key] === "" || validateData[key] === undefined || validateData[key] === null) {
                delete validateData[key];
            }
        });

        const updateFields = {};

        // 2. Comprehensive Password Validation Loop
        if (validateData.password) {
            if (!validateData.oldPassword) {
                return res.status(400).json({ message: "Please enter your old password" });
            }

            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found" });

            // FIXED: Extracted nested token from base sub-property 
            const oldHashedPassword = user.base?.password;
            if (!oldHashedPassword) {
                return res.status(500).json({ message: "Cryptographic hash field missing from target database record." });
            }

            const compareOldPassword = await bcrypt.compare(validateData.oldPassword, oldHashedPassword);
            if (!compareOldPassword) {
                return res.status(400).json({ message: "Old Password is incorrect" });
            }

            // Secure new cipher token generation
            updateFields["base.password"] = await bcrypt.hash(validateData.password, 10);
        }

        // 3. Dynamic payload assembly loops
        if (validateData.name) updateFields["base.name"] = validateData.name;
        if (validateData.email) updateFields["base.email"] = validateData.email;
        if (validateData.telephone) updateFields["base.telephone"] = validateData.telephone;
        if (validateData.businessName) updateFields["ownerInfo.businessName"] = validateData.businessName;

        // Map notification toggle adjustments safely
        if (validateData.preferences) {
            if (validateData.preferences.reviews_notifications !== undefined) {
                updateFields["ownerInfo.settings.reviews_notifications"] = validateData.preferences.reviews_notifications;
            }
            if (validateData.preferences.visits_notifications !== undefined) {
                updateFields["ownerInfo.settings.visits_notifications"] = validateData.preferences.visits_notifications;
            }
            if (validateData.preferences.weekly_report !== undefined) {
                updateFields["ownerInfo.settings.weekly_report"] = validateData.preferences.weekly_report;
            }
        }

        // Verify that we actually have fields to update before executing database transaction
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No operational attribute updates were specified." });
        }

        const updateUserData = await User.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        return res.status(200).json({ message: 'User updated successfully', data: updateUserData });

    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }
        next(err);
    }
};

userController.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // On tente le peuplement directement. 
        // Si finalUser.visits n'existe pas, Mongoose l'ignorera gentiment.
        const user = await User.findById(id).populate({ path: 'finalUser.visits' }).lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Logique de réponse différenciée
        if (user.base && user.base.role === "FINAL_USER") {
            return res.status(200).json({ message: 'User found', user });
        }

        // Pour les autres rôles (RESTO_ADMIN, etc.)
        return res.status(200).json({ message: 'User found', data: user });

    } catch (err) {
        next(err);
    }
};

userController.deleteUser = async (req, res, next) => {

    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully', data: user });
}

module.exports = userController;