const mongoose = require('mongoose');

const syncLogSchema = new mongoose.Schema(
    {
        pipeline_name: {
            type: String,
            enum: ['econtract_harvest', 'experience_check', 'red_flag_detector'],
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['running', 'completed', 'failed', 'partial'],
            default: 'running',
            index: true,
        },
        started_at: { type: Date, required: true, default: Date.now, index: true },
        completed_at: { type: Date },
        duration_minutes: { type: Number, min: 0 },
        contracts_scanned: { type: Number, default: 0 },
        contracts_new: { type: Number, default: 0 },
        contracts_updated: { type: Number, default: 0 },
        last_processed_tender_id: { type: String, trim: true },
        pages_scraped: { type: Number, default: 0 },
        errors: { type: [String], default: [] },
        error_count: { type: Number, default: 0 },
    },
    {
        collection: 'sync_logs',
        timestamps: true,
        suppressReservedKeysWarning: true,
    }
);

syncLogSchema.index({ pipeline_name: 1, started_at: -1 });

module.exports = mongoose.models.SyncLog || mongoose.model('SyncLog', syncLogSchema);
