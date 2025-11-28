const { default: mongoose } = require('mongoose');
const PointOfSale = require('../../models/pointOfSale.model');
const QRCode = require('qrcode');
const pointOfSaleController = {};



pointOfSaleController.getPointOfSale= async (req, res) => {
    try {
        console.log('Fetching visible restaurants');
        // Fetch only restaurants with visibility set to "show"
        const restaurants = await PointOfSale.find({ visibility: "show" });
        console.log('Visible restaurants:', restaurants);

        res.status(200).json(restaurants);
    } catch (error) {
        res.json({ error: 'Failed to fetch visible restaurants' });
    }
};

pointOfSaleController.getPointOfSaleByName = async (req, res) => {
    try {
        const { name } = req.params;

        console.log(`Fetching restaurant with name: ${name}`);
        
        // Find the restaurant by name (case-insensitive)
        const restaurant = await PointOfSale.findOne({name});
        
        if (!restaurant) {
            return res.json({ message: 'Restaurant not found' });
        }

        res.status(200).json(restaurant.id);
    } catch (error) {
        console.log('Error fetching restaurant by name:', error);
        res.status(500).json({ error: 'Failed to fetch restaurant by name' });
    }
};
pointOfSaleController.getPointOfSaleById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`Fetching restaurant with id: ${id}`);
        
        // Find the restaurant by name (case-insensitive)
        const restaurant = await PointOfSale.findById(id);
        
        if (!restaurant) {
            return res.json({ message: 'Restaurant not found' });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        console.log('Error fetching restaurant by id:', error);


        

        res.status(500).json({ error: 'Failed to fetch restaurant by id' });
    }
};

pointOfSaleController.getPointsOfSaleByOwnerId = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`Fetching restaurants with Owner id: ${id}`);
        
        // Find the restaurant by name (case-insensitive)
        const restaurants = await PointOfSale.find({ownerId: id});
        
        if (!restaurants) {
            return res.json({ message: 'Restaurant not found' });
        }

        res.status(200).json(restaurants);
    } catch (error) {
        console.log('Error fetching restaurant by name:', error);
        res.status(500).json({ error: 'Failed to fetch restaurant by name' });
    }
};

pointOfSaleController.getPointOfSaleQrCode = async (req, res) =>{
    try{
        const { codeData } = req.params;
        console.log("PARAM codeData =", codeData);

        // console.log(`Fetching restaurant with QR Code Data: ${qrCodeData}`);
        const restaurant = await PointOfSale.findById({_id:codeData.id});
        if (!restaurant) {
            return res.json({ message: 'Restaurant not found' });
        }
        res.status(200).json({message: "Point Of Sale Qr Code is:", qrCodeData: restaurant.qrCodeData});    
    }catch(error){
        console.log('Error fetching restaurant s QR Code:', error);
        res.status(500).json({ error: 'Failed to fetch restaurant s QR Code' });
    }
}


pointOfSaleController.getArchivedPointOfSsale = async (req,res) => {
    try {
        console.log('Fetching archived restaurants');
        // Fetch only restaurants with visibility set to "no show"
        const archivedRestaurants = await PointOfSale.find({ visibility: "no show" });
        console.log('Archived restaurants:', archivedRestaurants);
        res.status(200).json(archivedRestaurants);
    } catch (error) {
        res.json({ error: 'Failed to fetch archived restaurants' });
    }
};
pointOfSaleController.archivePointOfSale = async (req, res, next) => {
    try {
        const { id } = req.params;

        const foundRestaurant = await PointOfSale.findById(id);
        console.log('resto to update', foundRestaurant)
        if (!foundRestaurant) {
            return res.json({ message: 'Restaurant not found' });
        }

        // Update visibility to false
        foundRestaurant.visibility = 'no show'; // or false if you use boolean
        await foundRestaurant.save();

        return res.status(200).json({ message: 'Restaurant archived successfully', data: foundRestaurant });
    } catch (err) {
        next(err);
    }
};

pointOfSaleController.unarchivePointOfSale = async (req, res, next) => {
    try {
        const { id } = req.params;

        const foundRestaurant = await PointOfSale.findById(id);
        console.log('resto to update', foundRestaurant)
        if (!foundRestaurant) {
            return res.json({ message: 'Restaurant not found' });
        }

        // Update visibility to false
        foundRestaurant.visibility = 'show'; // or false if you use boolean
        await foundRestaurant.save();

        return res.status(200).json({ message: 'Restaurant unarchived successfully', data: foundRestaurant });
    } catch (err) {
        next(err);
    }
};

pointOfSaleController.createPointOfSale = async (req, res, next) => {
    console.log('Creating a new restaurant');
    try {
        const { name,
            ownerId,
            website,
            address:{
                city,
                country,
                state,
                street,
                zipCode
            },
            coverImage,
            phone,
            description,
            cuisine,
            status
        } = req.body;

        // Check if the restaurant name already exists
        const existingResto = await PointOfSale.findOne({ name });
        if (existingResto) {
            return res.status(400).json({ success: false, message: 'Restaurant with this name already exists.' });
        }
       

       

        // Create a new restaurant document
        const newRestaurant = new PointOfSale({
           name,
            ownerId,
            website,
            address: {
                city,
                country,
                state,
                street,
                zipCode
            }
            
            , coverImage,
            phone,
           
            description,
            cuisine,
            status
            // Optional, can be undefined
        });
  const qrData = JSON.stringify({
            id: newRestaurant._id,
            name: newRestaurant.name,

          
        }); // Generate QR code as data URL
                const qrCodeImage = await QRCode.toDataURL(qrData);
        newRestaurant.qrCodeData = qrCodeImage;
        const restaurant = await newRestaurant.save();
        res.status(201).json({ success: true, data: restaurant });
    } catch (err) {
        console.error('Error creating restaurant:', err.message);
        res.status(500).json({ error: 'Failed to create restaurant' });
    }
};

// Mettre à jour un restaurant
pointOfSaleController.updatePointOfSale = async (req, res) => {
  
    try {
        
    console.log('Update Point of Sale handler reached');
    const { id } = req.params;
    const updateData = req.body;
         console.log('Update Data', updateData);
if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({ message: 'Invalid ID format' });
}
         const restaurant = await PointOfSale.findByIdAndUpdate(id, updateData);
  
      if (!restaurant) {
        return res.json({ message: 'Restaurjdjdjdjant not found' });
      }
  
      // Send the updated restaurant data back to the client
      res.status(200).json(restaurant);
    } catch (error) {
      // Handle errors
      res.json({ message: error.message });
    }
};

pointOfSaleController.deletePointOfSale = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await PointOfSale.findByIdAndDelete(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        return res.status(200).json({ message: 'Restaurant deleted successfully', data: restaurant });
    } catch (err) {
        next(err);
    }
};

module.exports = pointOfSaleController;
