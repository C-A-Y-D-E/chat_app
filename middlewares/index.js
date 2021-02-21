const io = require("../server");
exports.init = (app) => {
  require("./passport").init(passport);
};
