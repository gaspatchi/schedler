import express from "express";
import bodyparser from "body-parser";
import { errorHandler } from "./middlewares/validate";
import config from "./config";
import init from "./lib/init";
import Consul from "consul";
import Schedule from "./routes/schedule";
import Metrics from "./routes/metrics";

let server = express();

server.use(bodyparser.json());
server.use(errorHandler);

server.use("/", Schedule);
server.use("/metrics", Metrics);

server.listen(config.server.port, config.server.address, () => {
	init();
});

process.on("SIGTERM", () => {
	let consul = Consul();
	consul.agent.service.deregister(config.server.name, () => {
		process.exit();
	});
});

process.on("SIGINT", () => {
	let consul = Consul();
	consul.agent.service.deregister(config.server.name, () => {
		process.exit();
	});
});

export default server;