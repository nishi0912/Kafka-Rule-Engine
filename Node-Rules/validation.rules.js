export const validation_rules = {
  id: 0,
  condition: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("--> Checking validation...");

    this.output = {
      success: false,
      errors: null,
      data: {
        user_id: null,
        template_id: null,
        phoneNumber: null,
        notificationType: null,
        subscribed: false,
        user_content_language: "en",
        email: null,
      },
    };
    // Convert the condition to false as result.
    await R.when(
      Object.keys(this).length === 1 ||
        !this.hasOwnProperty("templateType") ||
        !this.hasOwnProperty("userid")
    );
  },
  consequence: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log(
      "Validation failed. (Template, User or Required params) one of the parameters is missing."
    );
    this.output = {
      ...this.output,
      success: false,
      errors:
        "Validation failed. (Template, User or Required params) one of the parameters is missing.",
    };
    await R.stop();
  },
};
