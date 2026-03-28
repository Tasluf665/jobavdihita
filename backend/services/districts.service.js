const District = require('../models/district.model');

const listDistricts = async (isActive = true) => {
    const filter =
        typeof isActive === 'boolean' ? { is_active: isActive } : {};

    return District.find(filter)
        .sort({ name: 1 })
        .lean();
};

const getDistrictByName = async (name) =>
    District.findOne({ name: new RegExp(`^${name}$`, 'i') }).lean();

module.exports = {
    listDistricts,
    getDistrictByName,
};
