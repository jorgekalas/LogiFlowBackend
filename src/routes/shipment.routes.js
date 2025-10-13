import { Router } from "express";
import {
	listShipments,
	showCreate,
	createShipment,
	showEdit,
	updateShipment,
	deleteShipment,
} from "../controllers/shipment.controller.js";

const router = Router();

router.get("/", listShipments);
router.get("/new", showCreate);
router.post("/", createShipment);
router.get("/:id/edit", showEdit);
router.post("/:id/delete", deleteShipment);
router.put("/:id", updateShipment);

export default router;
