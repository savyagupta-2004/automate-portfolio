const chalk = require("chalk");

const colors = {
  primary: chalk.hex("#1e3a8a").bold, // Dark Blue headers
  secondary: chalk.hex("#4b5563"), // Dark Gray secondary text
  input: chalk.cyanBright, // Bright Cyan for user inputs
  success: chalk.hex("#059669").bold, // Emerald Green success
  warning: chalk.hex("#d97706").bold, // Amber warnings
  accent: chalk.hex("#3b82f6"), // Accent blue
  muted: chalk.hex("#6b7280"), // Muted Gray labels
};

module.exports = () => {
  console.log(colors.primary("\n■ Available Templates\n"));

  console.log(colors.accent(" ⚛ react"));
  console.log(colors.muted(" Modern React SPA with styled-components"));
  console.log(
    colors.muted(" Features: Responsive, animations, GitHub integration\n")
  );

  console.log(colors.success(" ▲ nextjs"));
  console.log(colors.muted(" Next.js with SSR and optimized performance"));
  console.log(
    colors.muted(
      " Features: SEO optimized, fast loading, server-side rendering\n"
    )
  );

  console.log(colors.warning(" ◆ html"));
  console.log(colors.muted(" Static HTML/CSS/JS website"));
  console.log(
    colors.muted(" Features: Lightweight, fast deployment, no build process\n")
  );

  console.log(colors.primary("▸ Usage:"));
  console.log(colors.muted(" create-portfolio my-portfolio --template react"));
  console.log(
    colors.muted(" create-portfolio my-portfolio --template nextjs\n")
  );
};
