const validateFields = (request, Model) => {
  const updates = Object.keys(request.body);
  const allowedUpdates = Object.keys(Model.schema.paths);
  return updates.every((update) => allowedUpdates.includes(update));
};

module.exports = validateFields;
