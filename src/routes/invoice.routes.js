import { Router } from "express";
import {
	listInvoices,
	showCreate,
	createInvoice,
	showEdit,
	updateInvoice,
	deleteInvoice,
} from "../controllers/invoice.controller.js";

const router = Router();

router.get("/", listInvoices);
router.get("/new", showCreate);
router.post("/", createInvoice);
router.get("/:id/edit", showEdit);
router.put("/:id", updateInvoice);
router.post("/:id/delete", deleteInvoice);

export default router;
