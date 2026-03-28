const mongoose = require('mongoose');

const officialStatsSchema = new mongoose.Schema(
    {
        total_approvals: { type: Number, default: 0 },
        total_value_approved: { type: Number, default: 0 },
        completed_count: { type: Number, default: 0 },
        overdue_count: { type: Number, default: 0 },
        ongoing_count: { type: Number, default: 0 },
        completion_rate_pct: { type: Number, default: 0 },
        impossible_timeline_count: { type: Number, default: 0 },
        total_unverified_payments: { type: Number, default: 0 },
    },
    { _id: false }
);

const officialSchema = new mongoose.Schema(
    {
        full_name: { type: String, required: true, trim: true },
        name_normalized: { type: String, required: true, trim: true },
        designation: { type: String, trim: true },
        office: { type: String, trim: true },
        department: { type: String, trim: true },
        district: { type: String, trim: true },
        first_recorded_approval: { type: Date },
        last_recorded_approval: { type: Date },
        stats: { type: officialStatsSchema, default: () => ({}) },
        accountability_level: {
            type: String,
            enum: ['low', 'moderate', 'high'],
            default: 'low',
        },
        updated_at: { type: Date, default: Date.now },
    },
    {
        collection: 'officials',
        timestamps: true,
    }
);

officialSchema.index({ name_normalized: 'text' });

module.exports =
    mongoose.models.Official || mongoose.model('Official', officialSchema);
