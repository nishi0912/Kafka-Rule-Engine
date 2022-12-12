import { findUser } from "../Db/Queries/index.js";

export const user_rules = {
  id: 1,
  condition: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("----> Validation was successfull.");
    this.output = {
      ...this.output,
      errors: null,
      success: true,
    };
    console.log(
      "------------------------------------------------------------------------"
    );
    const isUserFound = await findUser(this.userid, "boolean");
    console.log("--> Checking user...", isUserFound);
    await R.when(!isUserFound);
  },
  consequence: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("----> User not found.");
    this.output = {
      ...this.output,
      success: false,
      errors: "User not found.",
      data: {
        ...this.output.data,
        phoneNumber: null,
      },
    };
    await R.stop();
  },
};
