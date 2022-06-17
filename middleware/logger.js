const logger = (req, res, next) => {
  const method = req.method;
  const url = req.url;
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  var today = new Date();

  console.log(
    `[${today.toLocaleDateString(
      "en-US",
      options
    )}] Request received with method: ${method}, url: ${url}`
  );

  next();
};

module.exports = logger;
