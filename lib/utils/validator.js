function validateProjectName(name) {
  if (!name || name.trim() === "") {
    return "Project name is required";
  }

  if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name)) {
    return "Project name must start with a letter and contain only letters, numbers, hyphens, and underscores";
  }

  if (name.length > 50) {
    return "Project name must be less than 50 characters";
  }

  return true;
}

module.exports = { validateProjectName };
