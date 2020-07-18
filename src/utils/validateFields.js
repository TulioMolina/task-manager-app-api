const validateFields = (updates, Model) => {
  const allowedUpdates = Object.keys(Model.schema.paths);
  return updates.every((update) => allowedUpdates.includes(update));
};

module.exports = validateFields;
