import difference from "lodash/difference.js";
import filter from "lodash/filter.js";
import keys from "lodash/keys.js";
import {
  findTemplate,
  findTemplateLanguages,
  findUser,
} from "../Db/Queries/index.js";

const template_data = async (data, type) => {
  return (await findTemplate(data, type))[0];
};

export const required_params_rule = {
  id: 3,
  condition: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("----> Template was found.");
    console.log(
      "------------------------------------------------------------------------"
    );

    const template = await template_data(this.templateType, "value");

    let checkTemplateLanguages = keys(
      (await findTemplateLanguages(template?._id, "value"))[0]?.description
    );

    console.log("----> Checking template languages...", checkTemplateLanguages);
    const content_language = filter(checkTemplateLanguages, (language) => {
      return language === this.output.data.userLocale;
    });
    const language = content_language?.length > 0 ? content_language[0] : "en";
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log(
      content_language?.length === 0
        ? `------> User language was not found in template. Switching to default language --> ${language} `
        : `------> User language was found in templates --> ${language}`
    );
    this.output = {
      ...this.output,
      success: true,
      errors: null,
      data: {
        ...this.output.data,
        template_id: template?._id,
        user_content_language:
          content_language?.length > 0 ? content_language[0] : "en",
      },
    };
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("--> Checking Required params...");

    const template_params = template.requiredParams;
    const user_params = keys(this.data);

    const params_found =
      template_params?.length > user_params.length
        ? difference(template_params, user_params)
        : difference(user_params, template_params);

    this.params_found = params_found?.length === 0 ? true : false;
    await R.when(!this.params_found);
  },
  consequence: async function (R) {
    const template = await template_data(this.templateType, "value");

    const template_params = template.requiredParams;
    const user_params = keys(this.data);

    const params_found =
      template_params?.length > user_params.length
        ? difference(template_params, user_params)
        : difference(user_params, template_params);

    if (this.params_found) {
      this.output = {
        ...this.output,
        success: true,
        errors: null,
      };
    } else if (template_params?.length < user_params.length) {
      console.log(
        "------------------------------------------------------------------------"
      );
      console.log(
        `\u001b[1;31m----> ${params_found} was not found. Required Params are ${template_params}.\x1b[0m`
      );
      console.log(
        "------------------------------------------------------------------------"
      );
      this.output = {
        ...this.output,
        success: false,
        errors: `${params_found} was not found. Required Params are ${template_params}.`,
      };
    } else {
      console.log(
        "------------------------------------------------------------------------"
      );
      console.log(
        "----> ",
        "Required Params are",
        `\x1b[32m${template_params}.\x1b[0m`
      );
      console.log(
        "------------------------------------------------------------------------"
      );
      this.output = {
        ...this.output,
        success: false,
        errors: `Params was not found in Template required params. Required Params are ${template_params}`,
      };
    }
    await R.stop();
  },
};

export const template_rules = {
  id: 2,
  condition: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("----> User was found.");
    const user = await findUser(this.userid, "value");
    this.output = {
      ...this.output,
      success: true,
      errors: null,
      data: {
        ...this.output.data,
        user_id: user?._id,
        phoneNumber: user?.phoneNumber,
        email: user?.email,
        userLocale: user?.userLocale,
      },
    };
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log(
      "----> Checking user language -->",
      this.output.data.userLocale
    );
    console.log(
      "------------------------------------------------------------------------"
    );
    const isTemplateFound = await findTemplate(this.templateType, "boolean");
    console.log("--> Checking template...", isTemplateFound);
    await R.when(!isTemplateFound);
  },
  consequence: async function (R) {
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("----> Template is not found");
    this.output = {
      ...this.output,
      success: false,
      errors: "Template is not found.",
      data: {
        ...this.output.data,
        template_id: null,
      },
    };
    await R.stop();
  },
};

const template_rules_array = [template_rules, required_params_rule];

export { template_rules_array };
