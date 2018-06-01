exports.prepareId = (id, paramName, allowZero = false) => {
  id = parseInt(id);
  if (isNaN(id) || (!allowZero && !id)) throw { status: 400, message: `Invalid ${paramName}.` };
  return id;
};
