const getParamsQuerry = (arr) => {
  let results = arr.map((a, index) => {
    return "$" + `${index + 1}`;
  });
  return results.join(", ");
};

module.exports = {
  getParamsQuerry,
};
