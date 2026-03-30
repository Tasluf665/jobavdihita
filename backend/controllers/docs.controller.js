const sections = [
    {
        title: 'System',
        routes: [
            {
                method: 'GET',
                path: '/',
                description: 'Backend service heartbeat.',
            },
            {
                method: 'GET',
                path: '/api',
                description: 'API root status endpoint.',
            },
            {
                method: 'GET',
                path: '/api/health',
                description: 'Health check with current timestamp.',
            },
            {
                method: 'GET',
                path: '/api/docs',
                description: 'This API documentation page.',
            },
        ],
    },
    {
        title: 'Overview',
        routes: [
            { method: 'GET', path: '/api/overview/stats', description: 'Dashboard headline statistics.' },
            { method: 'GET', path: '/api/overview/alerts', description: 'Recent active alerts/red flags.' },
            { method: 'GET', path: '/api/overview/status-breakdown', description: 'Contract status breakdown.' },
            { method: 'GET', path: '/api/overview/recent-activity', description: 'Recently updated contracts and activity.' },
        ],
    },
    {
        title: 'Contracts',
        routes: [
            { method: 'GET', path: '/api/contracts', description: 'List contracts with filters and pagination.' },
            { method: 'GET', path: '/api/contracts/export', description: 'Export filtered contracts as CSV.' },
            { method: 'GET', path: '/api/contracts/:tender_id', description: 'Get one contract by tender id.' },
            { method: 'GET', path: '/api/contracts/:tender_id/timeline', description: 'Status/progress timeline for one contract.' },
            { method: 'GET', path: '/api/contracts/:tender_id/red-flags', description: 'Red flags for one contract.' },
        ],
    },
    {
        title: 'Red Flags',
        routes: [
            { method: 'GET', path: '/api/red-flags', description: 'List flagged contracts with filters.' },
            { method: 'GET', path: '/api/red-flags/summary', description: 'Flag summary counts by type.' },
            { method: 'GET', path: '/api/red-flags/critical', description: 'List only critical red flags.' },
        ],
    },
    {
        title: 'Contractors',
        routes: [
            { method: 'GET', path: '/api/contractors', description: 'List contractors with stats and pagination.' },
            { method: 'GET', path: '/api/contractors/search', description: 'Search contractors by text query.' },
            { method: 'GET', path: '/api/contractors/:id', description: 'Get contractor details by id.' },
            { method: 'GET', path: '/api/contractors/:id/contracts', description: 'Contracts of a specific contractor.' },
            { method: 'GET', path: '/api/contractors/:id/red-flags', description: 'Red flags for a specific contractor.' },
        ],
    },
    {
        title: 'Officials',
        routes: [
            { method: 'GET', path: '/api/officials', description: 'List officials with accountability stats.' },
            { method: 'GET', path: '/api/officials/search', description: 'Search officials by text query.' },
            { method: 'GET', path: '/api/officials/:id', description: 'Get official details by id.' },
            { method: 'GET', path: '/api/officials/:id/contracts', description: 'Contracts supervised by an official.' },
            { method: 'GET', path: '/api/officials/:id/patterns', description: 'Risk and pattern analysis for an official.' },
        ],
    },
    {
        title: 'Money',
        routes: [
            { method: 'GET', path: '/api/money/summary', description: 'Financial summary metrics.' },
            { method: 'GET', path: '/api/money/by-funding-source', description: 'Funding source distribution.' },
            { method: 'GET', path: '/api/money/yearly-spending', description: 'Year-wise spending trend.' },
            { method: 'GET', path: '/api/money/budget-vs-actual', description: 'Budget vs actual comparison.' },
            { method: 'GET', path: '/api/money/world-bank', description: 'World Bank funded contract summary.' },
        ],
    },
    {
        title: 'Field Reports',
        routes: [
            { method: 'GET', path: '/api/field-reports/:tender_id', description: 'List community reports for a contract.' },
            { method: 'POST', path: '/api/field-reports', description: 'Create a new community field report.' },
            { method: 'POST', path: '/api/field-reports/photo', description: 'Upload a report photo and receive URL.' },
        ],
    },
    {
        title: 'History',
        routes: [
            { method: 'GET', path: '/api/history/:tender_id', description: 'Status history for one contract.' },
            {
                method: 'GET',
                path: '/api/history/:tender_id/changes-only',
                description: 'History entries where a status change happened.',
            },
        ],
    },
    {
        title: 'Districts',
        routes: [
            { method: 'GET', path: '/api/districts', description: 'List district-level aggregates.' },
            { method: 'GET', path: '/api/districts/:name', description: 'Get one district aggregate by name.' },
        ],
    },
    {
        title: 'Search',
        routes: [{ method: 'GET', path: '/api/search', description: 'Global search across key entities.' }],
    },
    {
        title: 'Admin (requires x-admin-key header)',
        routes: [
            { method: 'GET', path: '/api/admin/sync-logs', description: 'List sync logs from all pipelines.' },
            { method: 'GET', path: '/api/admin/sync-logs/latest', description: 'Latest sync log entries by pipeline.' },
            { method: 'GET', path: '/api/admin/sync-logs/:id', description: 'Get one sync log by id.' },
            { method: 'POST', path: '/api/admin/jobs-trigger', description: 'Manually trigger a pipeline job.' },
            { method: 'GET', path: '/api/admin/db-stats', description: 'Database and collection statistics.' },
        ],
    },
];

const renderMethodClass = (method) => {
    if (method === 'GET') return 'method get';
    if (method === 'POST') return 'method post';
    return 'method';
};

const getApiDocumentation = (_req, res) => {
    const sectionsHtml = sections
        .map(
            (section) => `
            <section>
                <h2>${section.title}</h2>
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Method</th>
                                <th>Route</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${section.routes
                    .map(
                        (route) => `
                                    <tr>
                                        <td><span class="${renderMethodClass(route.method)}">${route.method}</span></td>
                                        <td><code>${route.path}</code></td>
                                        <td>${route.description}</td>
                                    </tr>
                                `
                    )
                    .join('')}
                        </tbody>
                    </table>
                </div>
            </section>
        `
        )
        .join('');

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Jobavdihita API Documentation</title>
            <style>
                :root {
                    color-scheme: light dark;
                    --bg: #0f172a;
                    --card: #111827;
                    --text: #e5e7eb;
                    --muted: #94a3b8;
                    --border: #1f2937;
                    --green: #16a34a;
                    --blue: #2563eb;
                }

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background: var(--bg);
                    color: var(--text);
                }

                .container {
                    width: min(1100px, 92vw);
                    margin: 40px auto 64px;
                }

                h1 {
                    margin: 0 0 8px;
                    font-size: 32px;
                }

                .subtitle {
                    margin: 0 0 28px;
                    color: var(--muted);
                }

                section {
                    background: var(--card);
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    padding: 18px;
                    margin-bottom: 18px;
                }

                h2 {
                    margin: 0 0 14px;
                    font-size: 18px;
                }

                .table-wrap {
                    overflow: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th,
                td {
                    text-align: left;
                    padding: 10px;
                    border-top: 1px solid var(--border);
                    vertical-align: top;
                    font-size: 14px;
                }

                th {
                    color: var(--muted);
                    font-weight: 600;
                    border-top: none;
                }

                code {
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
                        'Courier New', monospace;
                    font-size: 13px;
                }

                .method {
                    display: inline-block;
                    border-radius: 999px;
                    padding: 4px 10px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                }

                .method.get {
                    background: rgba(22, 163, 74, 0.2);
                    color: #86efac;
                }

                .method.post {
                    background: rgba(37, 99, 235, 0.2);
                    color: #93c5fd;
                }
            </style>
        </head>
        <body>
            <main class="container">
                <h1>Jobavdihita API Documentation</h1>
                <p class="subtitle">Static API reference generated from backend routes.</p>
                ${sectionsHtml}
            </main>
        </body>
        </html>
    `;

    res.status(200).type('html').send(html);
};

module.exports = {
    getApiDocumentation,
};
