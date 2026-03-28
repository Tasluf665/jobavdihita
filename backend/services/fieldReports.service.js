const mongoose = require('mongoose');
const Contract = require('../models/contract.model');
const FieldReport = require('../models/fieldReport.model');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');

const getFieldReportsByTenderId = async (tenderId, query) => {
    const contract = await Contract.findOne({ tender_id: tenderId }).select('_id tender_id').lean();
    if (!contract) {
        return null;
    }

    const { page, limit, skip } = parsePagination(query);

    const [items, total, counts] = await Promise.all([
        FieldReport.find({ contract_id: contract._id })
            .sort({ submitted_at: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        FieldReport.countDocuments({ contract_id: contract._id }),
        FieldReport.aggregate([
            { $match: { contract_id: new mongoose.Types.ObjectId(contract._id) } },
            { $group: { _id: '$observation_type', count: { $sum: 1 } } },
        ]),
    ]);

    const summary = counts.reduce(
        (acc, item) => {
            acc[item._id] = item.count;
            return acc;
        },
        { not_done: 0, partial: 0, done: 0 }
    );

    const totalReports = summary.not_done + summary.partial + summary.done;

    return {
        items,
        pagination: buildPaginationMeta({ total, page, limit }),
        consensus: {
            total_reports: totalReports,
            not_done_count: summary.not_done,
            partial_count: summary.partial,
            done_count: summary.done,
            not_done_pct: totalReports ? (summary.not_done / totalReports) * 100 : 0,
            partial_pct: totalReports ? (summary.partial / totalReports) * 100 : 0,
            done_pct: totalReports ? (summary.done / totalReports) * 100 : 0,
        },
    };
};

const createFieldReport = async (payload) => {
    const contract = await Contract.findOne({ tender_id: payload.tender_id })
        .select('_id tender_id description')
        .lean();

    if (!contract) {
        const error = new Error('Contract not found for tender_id');
        error.statusCode = 400;
        throw error;
    }

    return FieldReport.create({
        contract_id: contract._id,
        tender_id: contract.tender_id,
        project_description: contract.description,
        observation_type: payload.observation_type,
        details_text: payload.details_text,
        approximate_area: payload.approximate_area,
        report_source: payload.report_source || 'web',
    });
};

const attachPhotoToReport = async ({ report_id, photo_url }) => {
    if (!mongoose.Types.ObjectId.isValid(report_id)) {
        const error = new Error('Invalid report_id');
        error.statusCode = 400;
        throw error;
    }

    const report = await FieldReport.findByIdAndUpdate(
        report_id,
        { photo_url },
        { new: true }
    ).lean();

    if (!report) {
        const error = new Error('Field report not found');
        error.statusCode = 404;
        throw error;
    }

    return report;
};

module.exports = {
    getFieldReportsByTenderId,
    createFieldReport,
    attachPhotoToReport,
};
