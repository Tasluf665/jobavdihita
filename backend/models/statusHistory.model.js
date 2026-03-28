const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema(
    {
        contract_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contract',
            required: true,
        },
        tender_id: { type: String, required: true, trim: true },
        checked_at: { type: Date, required: true, default: Date.now },
        week_number: { type: String, trim: true, required: true },
        previous_status: { type: String, trim: true },
        new_status: { type: String, trim: true },
        previous_physical_pct: { type: Number },
        new_physical_pct: { type: Number },
        previous_financial_pct: { type: Number },
        new_financial_pct: { type: Number },
        changed: { type: Boolean, default: false },
        change_summary: { type: String, trim: true },
    },
    {
        collection: 'status_history',
        timestamps: true,
    }
);

statusHistorySchema.index({ contract_id: 1, checked_at: -1 });
statusHistorySchema.index({ checked_at: -1 });
statusHistorySchema.index({ changed: 1 });

module.exports =
    mongoose.models.StatusHistory ||
    mongoose.model('StatusHistory', statusHistorySchema);
