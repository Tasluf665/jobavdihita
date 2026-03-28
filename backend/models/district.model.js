const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        division: { type: String, trim: true },
        is_active: { type: Boolean, default: true },
        total_contracts: { type: Number, default: 0 },
        total_value: { type: Number, default: 0 },
        overdue_count: { type: Number, default: 0 },
        completion_rate_pct: { type: Number, default: 0 },
        last_synced_at: { type: Date },
    },
    {
        collection: 'districts',
        timestamps: true,
    }
);

module.exports =
    mongoose.models.District || mongoose.model('District', districtSchema);
