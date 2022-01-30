const {
    Router
} = require("express");
const checkController = require("../controllers/checkController");
const router = Router();
const {
    requireAuth
} = require('../middleware/authMiddleware')


router.post("/checks/create", requireAuth, checkController.addCheck);
router.put("/checks/edit/:id", requireAuth, checkController.editCheck);
router.post("/checks/pause/:id", requireAuth, checkController.pauseCheck);
router.post("/checks/resume/:id", requireAuth, checkController.resumeCheck);
router.delete("/checks/delete/:id", requireAuth, checkController.deleteCheck);
router.get("/checks/report/", requireAuth, checkController.getChecksReport);
router.get("/checks/report/:tag", requireAuth, checkController.getChecksReportByTag);


module.exports = router;