module.exports = function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
};
