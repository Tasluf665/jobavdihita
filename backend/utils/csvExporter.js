const escapeCsv = (value) => {
    if (value === null || value === undefined) {
        return '';
    }

    const str = String(value).replace(/"/g, '""');
    return /[",\n]/.test(str) ? `"${str}"` : str;
};

const toCsv = (rows = [], headers = []) => {
    const headerLine = headers.map((h) => escapeCsv(h.label)).join(',');
    const dataLines = rows.map((row) =>
        headers.map((h) => escapeCsv(row[h.key])).join(',')
    );
    return [headerLine, ...dataLines].join('\n');
};

module.exports = {
    toCsv,
};
