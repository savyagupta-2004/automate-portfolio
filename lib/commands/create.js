const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const path = require("path");
const { createPortfolio } = require("../utils/fileUtils");
const { fetchGitHubData } = require("../utils/github");
const { validateProjectName } = require("../utils/validator");

// Professional color palette
// Replace your colors object with this:
// Replace your colors object with this:
const colors = {
  primary: chalk.hex("#0F172A").bold, // Slate 900 - Headers
  secondary: chalk.hex("#475569"), // Slate 600 - Secondary text
  accent: chalk.hex("#3B82F6").bold, // Blue 500 - Accents
  success: chalk.hex("#059669").bold, // Emerald 600 - Success
  warning: chalk.hex("#DC2626").bold, // Red 600 - Warnings
  info: chalk.hex("#0891B2").bold, // Cyan 600 - Info
  muted: chalk.hex("#64748B"), // Slate 500 - Muted
  input: chalk.hex("#1E293B"), // Slate 800 - Input prompts
};

module.exports = async (name, options) => {
  // Clean professional header
  console.log(colors.primary("┌─ Portfolio CLI"));
  console.log(colors.muted("└─ Professional developer portfolio generator\n"));

  try {
    const answers = await getProjectDetails(name, options);
    await executeStepsWithSpinner(answers);
  } catch (error) {
    console.error(colors.primary("\n✗ Error: ") + error.message);
    process.exit(1);
  }
};

async function executeStepsWithSpinner(answers) {
  const steps = [
    {
      text: "Validating project setup",
      action: () => delay(600),
    },
    {
      text: "Fetching GitHub data",
      action: async () => {
        if (answers.github) {
          answers.githubData = await fetchGitHubData(answers.github);
        }
        await delay(1000);
      },
    },
    {
      text: "Generating portfolio files",
      action: async () => {
        await createPortfolio(answers);
        await delay(800);
      },
    },
    {
      text: "Finalizing project",
      action: () => delay(400),
    },
  ];

  // Execute steps with professional spinner
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    const spinner = ora({
      text: colors.muted(step.text),
      spinner: "dots",
      color: "blue",
    });

    spinner.start();
    await step.action();
    spinner.succeed(colors.success(step.text));
  }

  // Professional success output
  console.log("");
  console.log(colors.success("✓ Portfolio created successfully"));

  console.log(colors.primary("\n┌─ Project Details"));
  console.log(colors.muted("├─ Name:     ") + colors.secondary(answers.name));
  console.log(
    colors.muted("├─ Location: ") + colors.secondary("./" + answers.name)
  );
  console.log(
    colors.muted("├─ Template: ") + colors.secondary(answers.template)
  );
  console.log(
    colors.muted("└─ GitHub:   ") + colors.secondary(answers.github || "None")
  );

  console.log(colors.primary("\n┌─ Next Steps"));
  console.log(colors.muted("├─ ") + colors.accent("cd " + answers.name));
  console.log(colors.muted("├─ ") + colors.accent("npm install"));
  console.log(colors.muted("└─ ") + colors.accent("npm start"));
  console.log("");
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getProjectDetails(name, options) {
  const questions = [
    {
      type: "input",
      name: "headline",
      message: colors.primary("Headline (LinkedIn-style bio):"),
      validate: (v) => (v.trim() ? true : "Headline is required."),
    },
    {
      type: "input",
      name: "skills",
      message: colors.primary("Skills (comma separated):"),
      validate: (v) => (v.trim() ? true : "Skills are required."),
    },
    {
      type: "input",
      name: "education",
      message: colors.primary("Education (e.g. B.Tech CSE, VIT):"),
      validate: (v) => (v.trim() ? true : "Education is required."),
    },
    {
      type: "list",
      name: "hasExperience",
      message: colors.primary(
        "Do you have professional experience (full-time or intern)?"
      ),
      choices: [
        { value: true, name: colors.success("Yes") },
        { value: false, name: colors.warning("No") },
      ],
    },
    {
      type: "input",
      name: "experience",
      message: colors.primary("Experience details (Company, Role, Duration):"),
      when: (a) => a.hasExperience,
      validate: (v) =>
        v.trim() ? true : "Experience is required if you said Yes.",
    },
    {
      type: "input",
      name: "linkedin",
      message: colors.muted("LinkedIn URL (optional):"),
    },
    {
      type: "input",
      name: "github",
      message: colors.muted("GitHub URL (optional):"),
    },
    {
      type: "input",
      name: "otherSocials",
      message: colors.muted(
        "Other social/coding links (comma separated, optional):"
      ),
    },
  ];

  if (!name) {
    questions.push({
      type: "input",
      name: "name",
      message: colors.primary("Project name:"),
      validate: validateProjectName,
    });
  }

  if (options.interaction !== false) {
    // Fix the condition here
    questions.push(
      {
        type: "list",
        name: "template",
        message: colors.primary("Select template:"),
        choices: [
          {
            name: colors.secondary("React") + colors.muted(" - Modern SPA"),
            value: "react",
          },
          {
            name:
              colors.secondary("Next.js") + colors.muted(" - Full-stack SSR"),
            value: "nextjs",
          },
          {
            name: colors.secondary("HTML") + colors.muted(" - Static website"),
            value: "html",
          },
        ],
        default: options.template,
      },
      {
        type: "input",
        name: "title",
        message: colors.primary("Portfolio title:"),
        default: "Developer Portfolio",
      },
      {
        type: "input",
        name: "description",
        message: colors.primary("Brief description:"),
        default:
          "Full-stack developer passionate about creating amazing web experiences",
      }
    );
  }

  const answers = await inquirer.prompt(questions);

  // Return ALL the collected data
  return {
    name: name || answers.name,
    template: options.template || answers.template || "react",
    github: options.github || answers.github,
    title: answers.title || "Developer Portfolio",
    description:
      answers.description ||
      "Full-stack developer passionate about creating amazing web experiences",
    // ADD ALL THE MISSING FIELDS:
    headline: answers.headline,
    skills: answers.skills,
    education: answers.education,
    hasExperience: answers.hasExperience,
    experience: answers.experience,
    linkedin: answers.linkedin,
    otherSocials: answers.otherSocials,
    githubData: null,
  };
}
