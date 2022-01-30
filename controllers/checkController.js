const checkService = require("../services/checkService");
const reportService = require("../services/reportService");

module.exports.addCheck = async (req, res) => {
  try {
    const savedCheck = await checkService.addCheck(req.body);

    res.status(201).send({
      check: savedCheck,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
module.exports.editCheck = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedCheck = await checkService.editCheck(id, data);
    res.status(200).send({
      check: updatedCheck,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
module.exports.pauseCheck = async (req, res) => {
  try {
    const id = req.params.id;

    await checkService.pause(id);

    res.status(200).send({
      message: "Check Paused!",
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
module.exports.resumeCheck = async (req, res) => {
  try {
    const id = req.params.id;

    await checkService.resume(id);

    res.status(200).send({
      message: "Check resumed!",
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
module.exports.deleteCheck = async (req, res) => {
  try {
    const id = req.params.id;
    await checkService.deleteCheck(id);
    res.status(200).send({
      message: "Check deleted!",
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
module.exports.getChecksReport = async (req, res) => {
  try {
    const { id } = req.user;
    const report = await reportService.getCheckReport(id);

    res.status(200).send({
      report,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
module.exports.getChecksReportByTag = async (req, res) => {
  try {
    const tag = req.params.tag;
    const { id } = req.user;
    const report = await reportService.getCheckReportByTag(id, tag);

    res.status(200).send({
      report,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
