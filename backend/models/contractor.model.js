const mongoose = require('mongoose');

const contractorStatsSchema = new mongoose.Schema(
    {
        total_contracts: { type: Number, default: 0 },
        total_contract_value: { type: Number, default: 0 },
        completed_count: { type: Number, default: 0 },
        overdue_count: { type: Number, default: 0 },
        ongoing_count: { type: Number, default: 0 },
        completion_rate_pct: { type: Number, default: 0 },
        avg_delay_days: { type: Number, default: 0 },
        total_unverified_payments: { type: Number, default: 0 },
    },
    { _id: false }
);

const contractorSchema = new mongoose.Schema(
    {
        tenderer_id: { type: String, required: true, trim: true, unique: true },
        company_name: { type: String, required: true, trim: true },
        company_name_normalized: { type: String, required: true, trim: true },
        owner_name: { type: String, trim: true },
        business_address: { type: String, trim: true },
        district: { type: String, trim: true },
        egp_profile_url: { type: String, trim: true },
        first_seen_date: { type: Date },
        last_active_date: { type: Date },
        stats: { type: contractorStatsSchema, default: () => ({}) },
        risk_level: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low',
        },
        total_red_flags: { type: Number, default: 0 },
        updated_at: { type: Date, default: Date.now },
    },
    {
        collection: 'contractors',
        timestamps: true,
    }
);

contractorSchema.index({ company_name_normalized: 'text' });

module.exports =
    mongoose.models.Contractor || mongoose.model('Contractor', contractorSchema);
