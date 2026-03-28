const validateCreateFieldReport = (req) => {
    const { tender_id, observation_type, details_text } = req.body;
    const validObservationTypes = ['not_done', 'partial', 'done'];

    if (!tender_id) {
        return 'tender_id is required';
    }

    if (!observation_type || !validObservationTypes.includes(observation_type)) {
        return 'observation_type must be one of: not_done, partial, done';
    }

    if (details_text && details_text.length > 500) {
        return 'details_text must be at most 500 characters';
    }

    return null;
};

const validatePhotoUpload = (req) => {
    const { report_id, photo_url } = req.body;

    if (!report_id) {
        return 'report_id is required';
    }

    if (!photo_url) {
        return 'photo_url is required';
    }

    return null;
};

module.exports = {
    validateCreateFieldReport,
    validatePhotoUpload,
};
