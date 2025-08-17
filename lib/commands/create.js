const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const path = require("path");
const { createPortfolio } = require("../utils/fileUtils");
const { fetchGitHubData } = require("../utils/github");
const { validateProjectName } = require("../utils/validator");

// Professional color palette
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

// ADD THIS MISSING FUNCTION:
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
  console.log(colors.muted("├─ Name: ") + colors.secondary(answers.name));
  console.log(
    colors.muted("├─ Location: ") + colors.secondary("./" + answers.name)
  );
  console.log(
    colors.muted("├─ Template: ") + colors.secondary(answers.template)
  );
  console.log(
    colors.muted("└─ GitHub: ") + colors.secondary(answers.github || "None")
  );
  console.log(colors.primary("\n┌─ Next Steps"));
  console.log(colors.muted("├─ ") + colors.accent("cd " + answers.name));
  console.log(colors.muted("├─ ") + colors.accent("npm install"));
  console.log(colors.muted("└─ ") + colors.accent("npm start"));
  console.log("");
}

// ADD THIS HELPER FUNCTION TOO:
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper function to collect multiple education entries
async function collectEducation() {
  const educationList = [];
  let addMore = true;

  console.log(colors.accent("\n📚 Education Details"));
  console.log(
    colors.muted(
      "Add your educational qualifications (degree, institution, timeline)"
    )
  );

  while (addMore) {
    console.log(
      colors.info(`\n➤ Education Entry ${educationList.length + 1}:`)
    );

    const educationEntry = await inquirer.prompt([
      {
        type: "input",
        name: "degree",
        message: colors.primary(
          "Degree/Program (e.g., B.Tech Computer Science):"
        ),
        validate: (v) => (v.trim() ? true : "Degree is required."),
      },
      {
        type: "input",
        name: "institution",
        message: colors.primary("Institution/University name:"),
        validate: (v) => (v.trim() ? true : "Institution is required."),
      },
      {
        type: "input",
        name: "startYear",
        message: colors.muted("Start year (e.g., 2020):"),
        validate: (v) => {
          const year = parseInt(v);
          return year >= 1990 && year <= 2030
            ? true
            : "Please enter a valid year (1990-2030)";
        },
      },
      {
        type: "input",
        name: "endYear",
        message: colors.muted("End year (e.g., 2024) or 'Present':"),
        validate: (v) => {
          if (v.toLowerCase() === "present") return true;
          const year = parseInt(v);
          return year >= 1990 && year <= 2030
            ? true
            : "Please enter a valid year or 'Present'";
        },
      },
      {
        type: "input",
        name: "location",
        message: colors.muted("Location (optional - e.g., New York, USA):"),
      },
      {
        type: "input",
        name: "grade",
        message: colors.muted("Grade/GPA (optional - e.g., 3.8/4.0, 85%):"),
      },
    ]);

    educationList.push(educationEntry);

    const { continueAdding } = await inquirer.prompt([
      {
        type: "confirm",
        name: "continueAdding",
        message: colors.accent("Add another education entry?"),
        default: false,
      },
    ]);

    addMore = continueAdding;
  }

  return educationList;
}

// Helper function to collect multiple experience entries
async function collectExperience() {
  const experienceList = [];

  const { hasExperience } = await inquirer.prompt([
    {
      type: "confirm",
      name: "hasExperience",
      message: colors.primary(
        "Do you have any work experience (internships, full-time, projects)?"
      ),
      default: true,
    },
  ]);

  if (!hasExperience) return [];

  let addMore = true;

  console.log(colors.accent("\n💼 Work Experience Details"));
  console.log(
    colors.muted(
      "Add your work experience (company, role, duration, responsibilities)"
    )
  );

  while (addMore) {
    console.log(
      colors.info(`\n➤ Experience Entry ${experienceList.length + 1}:`)
    );

    const experienceEntry = await inquirer.prompt([
      {
        type: "input",
        name: "position",
        message: colors.primary(
          "Job Title/Position (e.g., Software Engineer Intern):"
        ),
        validate: (v) => (v.trim() ? true : "Position is required."),
      },
      {
        type: "input",
        name: "company",
        message: colors.primary("Company/Organization name:"),
        validate: (v) => (v.trim() ? true : "Company name is required."),
      },
      {
        type: "list",
        name: "employmentType",
        message: colors.primary("Employment Type:"),
        choices: [
          { name: "Full-time", value: "Full-time" },
          { name: "Internship", value: "Internship" },
          { name: "Part-time", value: "Part-time" },
          { name: "Contract", value: "Contract" },
          { name: "Freelance", value: "Freelance" },
        ],
      },
      {
        type: "input",
        name: "startDate",
        message: colors.muted("Start date (e.g., Jan 2023, 2023-01):"),
        validate: (v) => (v.trim() ? true : "Start date is required."),
      },
      {
        type: "input",
        name: "endDate",
        message: colors.muted("End date (e.g., Dec 2023, Present):"),
        validate: (v) => (v.trim() ? true : "End date is required."),
      },
      {
        type: "input",
        name: "location",
        message: colors.muted("Location (optional - e.g., New York, Remote):"),
      },
      {
        type: "input",
        name: "description",
        message: colors.muted("Brief description/key achievements (optional):"),
      },
    ]);

    experienceList.push(experienceEntry);

    const { continueAdding } = await inquirer.prompt([
      {
        type: "confirm",
        name: "continueAdding",
        message: colors.accent("Add another work experience?"),
        default: false,
      },
    ]);

    addMore = continueAdding;
  }

  return experienceList;
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

  // Collect education and experience
  console.log(
    colors.success(
      "\n✨ Let's gather your educational background and work experience..."
    )
  );

  const educationList = await collectEducation();
  const experienceList = await collectExperience();

  return {
    name: name || answers.name,
    template: options.template || answers.template || "react",
    github: options.github || answers.github,
    title: answers.title || "Developer Portfolio",
    description:
      answers.description ||
      "Full-stack developer passionate about creating amazing web experiences",
    headline: answers.headline,
    skills: answers.skills,
    linkedin: answers.linkedin,
    otherSocials: answers.otherSocials,
    educationList: educationList, // Multiple education entries
    experienceList: experienceList, // Multiple experience entries
    githubData: null,
  };
}

// Main module export
module.exports = async (name, options) => {
  console.log(colors.primary("┌─ Portfolio CLI"));
  console.log(colors.muted("└─ Professional developer portfolio generator\n"));

  try {
    const answers = await getProjectDetails(name, options);
    await executeStepsWithSpinner(answers);
  } catch (error) {
    console.error(colors.warning("\n✗ Error: ") + error.message);
    process.exit(1);
  }
};
