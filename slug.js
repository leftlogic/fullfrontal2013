module.exports = function (s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]+/g, '').replace(/\s+/g, '-');
};