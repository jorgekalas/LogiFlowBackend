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
router.put("/:id", updateShipment);
router.get("/:id/edit", showEdit);
router.post("/:id", updateShipment);
router.post("/:id/delete", deleteShipment); //para web
router.delete("/:id", deleteShipment); //para postman

export default router;
