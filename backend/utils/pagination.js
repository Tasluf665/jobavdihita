const parsePagination = (query = {}) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

const buildPaginationMeta = ({ total, page, limit }) => ({
    total,
    page,
    limit,
    total_pages: Math.max(1, Math.ceil(total / limit)),
});

module.exports = {
    parsePagination,
    buildPaginationMeta,
};
