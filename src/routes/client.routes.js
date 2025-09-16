import { Router } from "express";
import {
	listClients,
	showCreate,
	createClient,
	showEdit,
	updateClient,
	deleteClient,
} from "../controllers/client.controller.js";

const router = Router();

router.get("/", listClients);
router.get("/new", showCreate);
router.post("/", createClient);

router.put("/:id", updateClient);

router.get("/:id/edit", showEdit);
router.post("/:id", updateClient);
router.post("/:id/delete", deleteClient); //para web
router.delete("/:id", deleteClient); //para postman

export default router;
