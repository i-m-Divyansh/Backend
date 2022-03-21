exports.errorMessage = (res, code, err) => {
  let error = err.message;
  return res.status(code ? code : 400).json({ error });
};

exports.successMessage = (res, code, message, data) => {
  return res.status(code ? code : 200).json({ message, data });
};
