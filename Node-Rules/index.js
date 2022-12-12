import {} from "dotenv/config";
import axios from "axios";
import Rules from "node-rules";
import { rules } from "./rules.js";

// Creating Rules instance.
var Rule = new Rules();

class RuleService {
  constructor() {}

  performRule(data) {
    const fact = process.env.DATA || data;

    Rule.register(rules);
    Rule.ignoreFactChanges = true;
    Rule.execute(eval(fact), (data) => {
      if (data?.output?.success) {
        axios
          .post("http://localhost:3003/", data)
          .then(() => {
            console.log(
              "\x1b[32m Content Sent successufully to Content Engine."
            );
          })
          .catch((err) => {
            console.log(
              "\u001b[1;31m There was a problem sending data back to Content Engine."
            );
          });
      } else {
        console.log(
          "------------------------------------------------------------------------"
        );
        console.log("\u001b[1;31m", data?.output?.errors, "\x1b[0m");
        console.log(
          "------------------------------------------------------------------------"
        );
      }
    });
  }
}

export { Rule, RuleService };
