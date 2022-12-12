import { findTemplate } from "../Db/Queries/index.js";
import { Rule } from "./index.js";
import {
  default_subscription_rules,
  email_subscription_rules,
  push_subscription_rules,
  sms_subscription_rules,
} from "./subscription.rules.js";

const notification_type = async (data) => {
  return (await findTemplate(data, "value"))[0];
};

const via_push_rule = {
  id: 4,
  condition: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("----> Required Params was found.");
    this.output = {
      ...this.output,
      success: true,
      errors: null,
    };
    console.log(
      "------------------------------------------------------------------------",
      "\n"
    );
    console.log("Notification type", "\n");
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log(
      "--> Checking Push notification...",
      (await notification_type(this.templateType))?.viaPush
    );
    await R.when(!(await notification_type(this.templateType))?.viaPush);
  },
  consequence: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("----> Not via Push notification.");
    this.output = {
      ...this.output,
      errors: "Not via Push notification.",
      success: false,
      data: {
        ...this.output.data,
        notificationType: null,
      },
    };
    Rule.turn("OFF", {
      id: 5,
    });
    await R.next();
  },
};

const via_sms_rule = {
  id: 6,
  condition: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log(
      "-->  Checking Sms notification...",
      (await notification_type(this.templateType))?.viaSms
    );
    this.output = {
      ...this.output,
      errors: null,
    };
    await R.when(!(await notification_type(this.templateType))?.viaSms);
  },
  consequence: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("----> Not via Sms notification.");
    this.output = {
      ...this.output,
      success: false,
      errors: "Not via Sms notification.",
    };
    Rule.turn("OFF", {
      id: 7,
    });
    await R.next();
  },
};

const via_email_rule = {
  id: 8,
  condition: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    this.output = {
      ...this.output,
      errors: null,
    };
    console.log(
      "-->  Checking Email notification...",
      (await notification_type(this.templateType))?.viaEmail
    );
    await R.when(!(await notification_type(this.templateType))?.viaEmail);
  },
  consequence: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("----> Not via Email notification.");
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log(
      'Via is not provided by user. Switching to default message type --> "Push Notification".'
    );
    this.output = {
      ...this.output,
      success: false,
      errors:
        "Not via Email notification. Via is not provided by user. Switching to default message type --> 'Push Notification'.",
      data: {
        ...this.output.data,
        notificationType: null,
      },
    };
    Rule.turn("OFF", {
      id: 9,
    });
    await R.next();
  },
};

const via_default_notification_rule = {
  id: 10,
  condition: async function (R) {
    // Message will be sent throught highest priority notification type -> 'Push'.
    R.when(true);
  },
  consequence: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log(
      "----> Sending the message through default notification type -> via Push notification."
    );
    this.output = {
      ...this.output,
      success: false,
      errors: `User did not select any of the notification type. Sending the message via Push notification.`,
    };
    // Turning 'ON' default notification type for subscription check, if none are selected by user.
    await R.next();
  },
};

// Rules array defined according to priority, -> 1. Push, 2. Sms, 3. Email.

const via_push_rule_array = [via_push_rule, push_subscription_rules];
const via_sms_rule_array = [via_sms_rule, sms_subscription_rules];
const via_email_rule_array = [via_email_rule, email_subscription_rules];

const notification_rules_array = [
  ...via_push_rule_array,
  ...via_sms_rule_array,
  ...via_email_rule_array,
  via_default_notification_rule,
  default_subscription_rules,
];

export { notification_rules_array };
