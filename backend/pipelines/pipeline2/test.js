const { processSingleContractStatus } = require('./index');

contract = {
    "_id": "69c84ad798a46fed36b88d57",
    "tender_id": "1152180",
    "__v": 0,
    "bidder_count": 64,
    "computed_status": "not_started",
    "contract_end_date": "2026-01-13T00:00:00.000Z",
    "contract_start_date": "2025-10-25T00:00:00.000Z",
    "contract_value": 6834171.75,
    "contractor_id": {
        "_id": "69c84a4398a46fed36b88c15",
        "company_name": "Taif International Corporation",
        "risk_level": "low",
        "tenderer_id": "unknown_taif_international_corporation"
    },
    "createdAt": "2026-03-28T21:40:39.138Z",
    "days_overdue": 0,
    "description": "a) Estimate for Improvment Road by RCC at 7 no Baghaikandi GPS Road at Ch.00-420m under Charkeyor Up 16-Sep-2025 20:00",
    "detail_url": "https://www.eprocure.gov.bd/resources/common/ViewAwardedContracts.jsp?pkgLotId=1813179&tenderid=1152180",
    "district": "Munshiganj",
    "fetched_at": "2026-03-28T21:40:39.138Z",
    "funding_source": "Development Government",
    "last_synced_at": "2026-03-29T02:24:04.644Z",
    "notification_date": "2026-01-04T00:00:00.000Z",
    "official_id": {
        "_id": "69c84a4498a46fed36b88c16",
        "accountability_level": "low",
        "full_name": "Saleh Hasan Pramanik"
    },
    "package_number": "e-Tender/MUN/SADA/UDF/2025-26/W-15",
    "procurement_method": "LTM",
    "procuring_entity": "Office of the Upazila Engineer, Munshiganj Sadar, Munshiganj",
    "red_flags": [],
    "signing_date": "2026-01-04T00:00:00.000Z",
    "updatedAt": "2026-03-29T02:24:04.644Z",
    "work_status": {
        "status_label": "Not Found",
        "physical_progress_pct": 0,
        "financial_progress_pct": 0,
        "payment_gap_pct": 0,
        "has_payment_gap_flag": false,
        "latest_milestone_date": null,
        "completion_certificate": false,
        "checked_at": "2026-03-29T02:24:04.644Z"
    }
}

processSingleContractStatus({ contract }).then((result) => {
    console.log('Processed Contract Status Result:', result);
}).catch((error) => {
    console.error('Error processing contract status:', error);
});