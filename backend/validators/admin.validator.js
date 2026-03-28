const validateTriggerJob = (req) => {
    const { pipeline_name } = req.body;
    const allowed = ['econtract_harvest', 'experience_check', 'red_flag_detector'];

    if (!pipeline_name || !allowed.includes(pipeline_name)) {
        return 'pipeline_name must be one of: econtract_harvest, experience_check, red_flag_detector';
    }

    return null;
};

module.exports = {
    validateTriggerJob,
};
