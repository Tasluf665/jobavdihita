const MONTH_INDEX = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
};

const parseDdMmmYyyy = (value) => {
    const match = String(value || '').match(/(\d{1,2})-([A-Za-z]{3})-(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
    if (!match) {
        return null;
    }

    const day = Number(match[1]);
    const month = MONTH_INDEX[match[2]];
    const year = Number(match[3]);
    const hour = match[4] ? Number(match[4]) : 0;
    const minute = match[5] ? Number(match[5]) : 0;

    if (month === undefined) {
        return null;
    }

    return new Date(Date.UTC(year, month, day, hour, minute));
};

const parseDdMmYyyy = (value) => {
    const match = String(value || '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) {
        return null;
    }

    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    return new Date(Date.UTC(year, month, day));
};

const parseEprocureDate = (value) =>
    parseDdMmmYyyy(value) || parseDdMmYyyy(value) || null;

module.exports = {
    parseEprocureDate,
};
