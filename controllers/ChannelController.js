const AsynCatch = require("../utils/AsynCatch");
const Channel = require("../models/Channel.Model");
const { getAll, create } = require("../controllers/handleFactory");

exports.getAll = getAll(Channel);

exports.create = create(Channel);
