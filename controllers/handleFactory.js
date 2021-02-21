const AsynCatch = require("../utils/AsynCatch");
const AppError = require("../utils/AppError");
const ApiFeatures = require("../utils/apiFeatures");
exports.getAll = (Model) =>
  AsynCatch(async (req, res) => {
    const features = new ApiFeatures(Model.find({}), req.query)
      .search()
      .sort()
      .fields()
      .paginate();
    const docs = await features.query;
    if (!docs.length > 0) {
      return res.status(200).json({
        status: "success",
        data: null,
      });
    }
    res.status(200).json({
      status: "success",
      total: docs.length,
      data: docs,
    });
  });

exports.create = (Model) =>
  AsynCatch(async (req, res) => {
    const docs = await Model.create(req.body);
    res.status(201).json({
      status: "Success",
      data: docs,
    });
  });
