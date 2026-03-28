const mongoose = require('mongoose');

const fieldReportSchema = new mongoose.Schema(
    {
        contract_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contract',
            required: true,
        },
        tender_id: { type: String, required: true, trim: true },
        project_description: { type: String, trim: true },
        observation_type: {
            type: String,
            enum: ['not_done', 'partial', 'done'],
            required: true,
            index: true,
        },
        details_text: { type: String, trim: true },
        photo_url: { type: String, trim: true },
        approximate_area: { type: String, trim: true },
        submitted_at: { type: Date, default: Date.now, index: true },
        is_anonymous: { type: Boolean, default: true },
        report_source: { type: String, enum: ['web', 'mobile'], default: 'web' },
    },
    {
        collection: 'field_reports',
        timestamps: true,
    }
);

fieldReportSchema.index({ contract_id: 1, submitted_at: -1 });

module.exports =
    mongoose.models.FieldReport || mongoose.model('FieldReport', fieldReportSchema);
