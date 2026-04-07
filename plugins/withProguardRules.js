const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const PROGUARD_RULES = `
# Fix R8 missing class: KeepAwakeManager referenced by expo-av
-dontwarn expo.modules.core.interfaces.services.KeepAwakeManager
`;

function withProguardRules(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const proguardFile = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "proguard-rules.pro"
      );

      let existing = "";
      if (fs.existsSync(proguardFile)) {
        existing = fs.readFileSync(proguardFile, "utf8");
      }

      if (!existing.includes("KeepAwakeManager")) {
        fs.appendFileSync(proguardFile, PROGUARD_RULES);
      }

      return config;
    },
  ]);
}

module.exports = withProguardRules;
