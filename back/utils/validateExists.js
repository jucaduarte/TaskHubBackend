async function validateExists(Model, where) {
    const record = await Model.findOne({ where });
    return !!record;
}

module.exports = validateExists;