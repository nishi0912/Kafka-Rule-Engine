import {} from "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import connection from "./Db/index.js";
import { Users } from "./Db/Models/user.model.js";
import { RuleService } from "./Node-Rules/index.js";
import { Activities_Update } from "./Db/Queries/index.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  console.log({ req, res });
});

const RuleInput = new RuleService();

app.post("/rule-engine", (req, res) => {
  console.log(
    "------------------------------------------------------------------------"
  );
  console.log(
    "\x1b[32mData Received from NSL( Notification Service Layer )\x1b[0m"
  );
  console.log(
    "------------------------------------------------------------------------"
  );

  Activities_Update("Route 2", req.body?.activity_id);

  console.log(req.body);
  const output = RuleInput.performRule(req.body);
  res.send(output);
});

const PORT = process.env.PORT || 3002;

connection;

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});
