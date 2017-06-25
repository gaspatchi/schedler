import express from "express";
import { registry } from "../lib/prometheus";

let metrics_router = express.Router();

metrics_router.get("/", (req, res) => {
	res.set("Content-Type", registry.contentType);
	res.end(registry.metrics());
});

export default metrics_router;