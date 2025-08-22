const express = require("express");
const router = express.Router();
const RoleController = require("./role.controller");

router.post("/", RoleController.create);
router.get("/", RoleController.getAll);
router
    .route("/:roleId")
    .get(RoleController.getOne)
    .put(RoleController.update)
    .delete(RoleController.delete);


module.exports = router;