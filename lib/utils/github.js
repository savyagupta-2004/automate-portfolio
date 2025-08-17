const axios = require("axios");
const chalk = require("chalk");

async function fetchGitHubData(username) {
  try {
    const [userResponse, reposResponse] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`),
      axios.get(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`
      ),
    ]);

    const user = userResponse.data;
    const repos = reposResponse.data
      .filter((repo) => !repo.fork && repo.description)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        updated_at: repo.updated_at,
      }));

    return {
      user: {
        name: user.name,
        bio: user.bio,
        avatar_url: user.avatar_url,
        location: user.location,
        blog: user.blog,
        public_repos: user.public_repos,
        followers: user.followers,
      },
      repositories: repos,
    };
  } catch (error) {
    console.log(
      chalk.yellow("⚠️  Could not fetch GitHub data. Continuing without it.")
    );
    return null;
  }
}

module.exports = { fetchGitHubData };
