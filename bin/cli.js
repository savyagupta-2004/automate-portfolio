#!/usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const packageJson = require("../package.json");

// Professional corporate colors - ADD THE MISSING SECONDARY COLOR
// Add warning color here too:
const colors = {
  primary: chalk.hex("#0F172A").bold, // Slate 900 - Professional dark
  secondary: chalk.hex("#475569"), // Slate 600 - Muted professional
  accent: chalk.hex("#3B82F6").bold, // Blue 500 - Professional accent
  success: chalk.hex("#059669").bold, // Emerald 600 - Success green
  warning: chalk.hex("#DC2626").bold, // Red 600 - Professional warning
  muted: chalk.hex("#64748B"), // Slate 500 - Subtle text
  info: chalk.hex("#0891B2").bold, // Cyan 600 - Info blue
};

console.log(colors.primary("┌─ Portfolio CLI"));
console.log(
  colors.secondary("└─ Professional developer portfolio generator\n")
);

program
  .name("create-portfolio")
  .description("Generate professional developer portfolios")
  .version(packageJson.version);

program
  .command("create [name]")
  .description("Create a new portfolio website")
  .option(
    "-t, --template <template>",
    "Choose template (react, nextjs, html)",
    "react"
  )
  .option("-g, --github <username>", "Import projects from GitHub")
  .option("--no-interaction", "Skip interactive prompts")
  .action(require("../lib/commands/create"));

program
  .command("themes")
  .description("List available themes")
  .action(require("../lib/commands/themes"));

program.parse();
