const validateFields = (updates, Model) => {
  if (updates.length === 0) {
    return false;
  }
  const allowedUpdates = Object.keys(Model.schema.paths);
  return updates.every((update) => allowedUpdates.includes(update));
};

module.exports = validateFields;
