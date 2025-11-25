const PointOfSale = require('../../models/pointOfSale.model');
const qrcodeController = {};

qrcodeController.scanQr = async (req, res) => {
  try {
    const { qrCodeData } = req.params; // or req.body.qrCodeData if POST
    // Find POS by qrCodeData
    const pos = await PointOfSale.findOne({ qrCodeData });

    if (!pos) {
      return res.status(404).json({ message: 'POS not found' });
    }

    // Return POS info so frontend / Postman knows where to upload
    res.status(200).json({
      message: 'POS found. You can upload a post now.',
      posId: pos._id,
      posName: pos.name
    });

  } catch (err) {
    console.error('Error scanning QR:', err);
    res.status(500).json({ message: 'Failed to scan POS QR code.' });
  }
};

module.exports = qrcodeController;
