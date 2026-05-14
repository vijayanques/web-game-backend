const { AdConfig } = require('../models');

// Get all active ad configurations (Public)
exports.getAdConfigs = async (req, res) => {
  try {
    const ads = await AdConfig.findAll({
      where: { status: true },
      attributes: ['slot', 'adClient', 'adSlot', 'adType', 'responsive', 'imageUrl', 'targetUrl', 'allowedPages']
    });

    res.status(200).json({
      success: true,
      data: ads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ad configurations',
      error: error.message,
    });
  }
};

// Get all ad configurations for admin
exports.getAllAdConfigs = async (req, res) => {
  try {
    const ads = await AdConfig.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: ads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all ad configurations',
      error: error.message,
    });
  }
};

// Create or update ad configuration
exports.upsertAdConfig = async (req, res) => {
  try {
    const { slot, adClient, adSlot, adType, responsive, status, imageUrl, targetUrl, allowedPages } = req.body;

    if (!slot) {
      return res.status(400).json({
        success: false,
        message: 'slot is required',
      });
    }

    // Find if slot already exists
    let ad = await AdConfig.findOne({ where: { slot } });

    if (ad) {
      // Update existing
      ad.adClient = adClient || ad.adClient;
      ad.adSlot = adSlot || ad.adSlot;
      ad.imageUrl = imageUrl || ad.imageUrl;
      ad.targetUrl = targetUrl || ad.targetUrl;
      ad.adType = adType || ad.adType;
      ad.allowedPages = allowedPages !== undefined ? allowedPages : ad.allowedPages;
      ad.responsive = responsive !== undefined ? responsive : ad.responsive;
      ad.status = status !== undefined ? status : ad.status;
      await ad.save();
    } else {
      // Create new
      ad = await AdConfig.create({
        slot,
        adClient,
        adSlot,
        imageUrl,
        targetUrl,
        adType: adType || 'static',
        allowedPages: allowedPages || null,
        responsive: responsive !== undefined ? responsive : true,
        status: status !== undefined ? status : true,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ad configuration saved successfully',
      data: ad,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving ad configuration',
      error: error.message,
    });
  }
};

// Delete ad configuration
exports.deleteAdConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await AdConfig.findByPk(id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad configuration not found',
      });
    }

    await ad.destroy();

    res.status(200).json({
      success: true,
      message: 'Ad configuration deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting ad configuration',
      error: error.message,
    });
  }
};
