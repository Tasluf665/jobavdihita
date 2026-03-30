const truncateText = (value = '', maxLength = 36) => {
    const text = String(value || '').trim();
    if (!text || text.length <= maxLength) {
        return text;
    }

    const sliced = text.slice(0, maxLength);
    const lastSpaceIndex = sliced.lastIndexOf(' ');
    const smartCut = lastSpaceIndex > 12 ? sliced.slice(0, lastSpaceIndex) : sliced;

    return `${smartCut}...`;
};

export default truncateText;
