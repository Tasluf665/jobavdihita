const mongoose = require('mongoose');

const workStatusSchema = new mongoose.Schema(
    {
        status_label: { type: String, trim: true },
        physical_progress_pct: { type: Number, min: 0, max: 100 },
        financial_progress_pct: { type: Number, min: 0, max: 100 },
        payment_gap_pct: { type: Number },
        has_payment_gap_flag: { type: Boolean, default: false },
        latest_milestone_date: { type: Date },
        completion_certificate: { type: Boolean, default: false },
        checked_at: { type: Date },
    },
    { _id: false }
);

const redFlagSchema = new mongoose.Schema(
    {
        flag_type: {
            type: String,
            enum: [
                'impossible_timeline',
                'single_bidder',
                'zero_variance',
                'payment_gap',
                'repeat_winner',
                'ghost_project',
                'min_sale_period',
            ],
            required: true,
        },
        severity: { type: String, enum: ['critical', 'warning'], required: true },
        title: { type: String, trim: true, required: true },
        description: { type: String, trim: true, required: true },
        evidence: { type: mongoose.Schema.Types.Mixed, default: {} },
        detected_at: { type: Date, default: Date.now },
    },
    { _id: false }
);

const contractSchema = new mongoose.Schema(
    {
        tender_id: { type: String, required: true, trim: true, unique: true },
        package_number: { type: String, trim: true },
        description: { type: String, trim: true },
        district: { type: String, trim: true },
        upazila: { type: String, trim: true },
        procuring_entity: { type: String, trim: true },
        procurement_method: { type: String, trim: true },
        funding_source: { type: String, trim: true },
        estimated_budget: { type: Number },
        contract_value: { type: Number },
        budget_variance_pct: { type: Number },
        notification_date: { type: Date },
        signing_date: { type: Date },
        contract_start_date: { type: Date },
        contract_end_date: { type: Date },
        bidder_count: { type: Number, min: 0 },
        document_sale_days: { type: Number, min: 0 },
        contractor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contractor',
            index: true,
        },
        official_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Official',
            index: true,
        },
        work_status: { type: workStatusSchema, default: () => ({}) },
        red_flags: { type: [redFlagSchema], default: [] },
        computed_status: {
            type: String,
            enum: ['completed', 'ongoing', 'overdue', 'ghost', 'not_started'],
            default: 'not_started',
            index: true,
        },
        days_overdue: { type: Number, default: 0 },
        detail_url: { type: String, trim: true },
        fetched_at: { type: Date, default: Date.now },
        last_synced_at: { type: Date },
    },
    {
        collection: 'contracts',
        timestamps: true,
    }
);

contractSchema.index({ district: 1 });
contractSchema.index({ procuring_entity: 1 });
contractSchema.index({ funding_source: 1 });
contractSchema.index({ contract_value: 1 });
contractSchema.index({ contract_start_date: 1 });
contractSchema.index({ contract_end_date: 1 });

module.exports =
    mongoose.models.Contract || mongoose.model('Contract', contractSchema);
