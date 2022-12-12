import upperCase from "lodash/upperCase.js";
import { findUser } from "../Db/Queries/index.js";
import { Rule } from "./index.js";

const checkSubscriptions = async (data) => {
  return await findUser(data, "value");
};

const push_subscription_rules = {
  id: 5,
  condition: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("---->  Via Push notification...");
    console.log(
      "------------------------------------------------------------------------"
    );
    const check_push_subscription = (await checkSubscriptions(this.userid))
      ?.isPushUnsub;

    console.log(
      "------>  Checking Push subscription...",
      !check_push_subscription
    );
    // Convert the condition to false as result.
    await R.when(!check_push_subscription);
  },
  consequence: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("--------> Subscribed to Push notifications.");
    this.output = {
      ...this.output,
      success: true,
      data: {
        ...this.output.data,
        notificationType: "push",
        subscribed: true,
      },
      errors: null,
    };
    Rule.turn("OFF", {
      id: 6,
      id: 7,
      id: 10,
    });
    await R.stop();
  },
};

const sms_subscription_rules = {
  id: 7,
  condition: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("---->  Via Sms notification...");
    const check_sms_subscription = (await checkSubscriptions(this.userid))
      ?.isSmsUnsub;
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log(
      "------>  Checking Sms subscription...",
      !check_sms_subscription
    );
    await R.when(!check_sms_subscription);
  },
  consequence: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("--------> Subscribed to Sms notifications.");
    this.output = {
      ...this.output,
      success: true,
      data: {
        ...this.output.data,
        notificationType: "sms",
        subscribed: true,
      },
      errors: null,
    };
    await R.stop();
  },
};

const email_subscription_rules = {
  id: 9,
  condition: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("---->  Via Email notification...");
    const check_email_subscription = (await checkSubscriptions(this.userid))
      ?.isEmailUnsub;
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log(
      "------>  Checking Email subscription...",
      !check_email_subscription
    );
    Rule.turn("OFF", {
      id: 10,
    });
    // Convert the condition to false as result.
    await R.when(!check_email_subscription);
  },
  consequence: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("--------> Subscribed to Email notifications.");
    this.output = {
      ...this.output,
      success: true,
      data: {
        ...this.output.data,
        notificationType: "email",
        subscribed: true,
      },
      errors: null,
    };
    Rule.turn("OFF", {
      id: 10,
      id: 11,
    });
    await R.stop();
  },
};

const default_subscription_rules = {
  id: 11,
  condition: async function (R) {
    await R.when(true);
  },
  consequence: async function (R) {
    const check_subscription = await checkSubscriptions(this.userid);
    const is_subscribed = check_subscription?.isPushUnsub
      ? check_subscription?.isSmsUnsub
        ? check_subscription?.isEmailUnsub
          ? false
          : true
        : true
      : true;
    const notification_type = check_subscription?.isPushUnsub
      ? check_subscription?.isSmsUnsub
        ? check_subscription?.isEmailUnsub
          ? null
          : "email"
        : "sms"
      : "push";

    console.log(
      "------------------------------------------------------------------------"
    );
    console.log(
      `------> Checking Subscription... ->  '${notification_type}'`,
      is_subscribed
    );
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log(
      `${
        notification_type
          ? `Subscribed to ${notification_type}`
          : "None of the notification types were subscribed."
      }`
    );
    this.output = {
      ...this.output,
      success: is_subscribed,
      data: {
        ...this.output.data,
        notificationType: notification_type,
        subscribed: is_subscribed,
      },
      errors: is_subscribed
        ? null
        : "Please subscribe to any one of the notification types and try again.",
    };
    await R.stop();
  },
};

export {
  push_subscription_rules,
  sms_subscription_rules,
  email_subscription_rules,
  default_subscription_rules,
};
