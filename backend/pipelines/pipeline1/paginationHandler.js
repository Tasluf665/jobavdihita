const buildPageList = (totalPages, maxPages) => {
    const total = Math.max(1, Number(totalPages) || 1);
    const bounded = maxPages ? Math.min(total, Number(maxPages)) : total;

    return Array.from({ length: bounded }, (_, index) => index + 1);
};

module.exports = {
    buildPageList,
};
