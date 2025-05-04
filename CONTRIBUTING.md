# Contributing to PromptMask

Thank you for considering contributing to PromptMask! This document outlines the process for contributing to the project and provides guidelines to make the contribution process smooth and effective.

## Code of Conduct

By participating in this project, you agree to abide by the following principles:

- Be respectful and inclusive of all contributors
- Exercise empathy and kindness in all interactions
- Accept constructive criticism gracefully
- Focus on what is best for the community and users

## How Can I Contribute?

### Reporting Bugs

Before submitting a bug report, please check if the issue has already been reported by searching the [Issues](https://github.com/wassim-azi/PromptMask/issues) page.

When reporting a bug, please include:

- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior vs. actual behavior
- Screenshots if applicable
- Browser type and version
- Any other relevant information

### Suggesting Enhancements

Enhancement suggestions are welcome! When suggesting enhancements:

- Use a clear and descriptive title
- Describe the current behavior and explain the behavior you expected
- Explain why this enhancement would be useful for users
- Provide examples of how it would be used if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes with meaningful commit messages
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Your First Code Contribution

New to the project? Here are some beginner-friendly issues to start with:

- Improving documentation
- Bug fixes in the content scripts
- UI/UX improvements
- Translations for additional languages

## Development Setup

1. Make sure you have [Node.js](https://nodejs.org/) (v16 or newer) installed
2. We use [pnpm](https://pnpm.io/installation) as our package manager
3. Clone the repository and install dependencies:

```bash
git clone https://github.com/wassim-azi/PromptMask.git
cd PromptMask
pnpm install
```

4. Start the development server:

```bash
pnpm dev
```

5. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build/chrome-mv3-dev` directory

## Coding Standards

- Use TypeScript for all new code
- Follow the existing code style (we use Prettier for formatting)
- Write self-documenting code and add comments when necessary
- Ensure your code works across Chrome, Brave and Edge

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

## Testing

We encourage testing all changes before submitting a PR:

- Test your changes in different browsers
- Test on multiple AI platforms
- Verify that existing functionality still works

## Documentation

If your changes require updates to documentation:

- Update the README.md if necessary
- Add comments to your code to explain complex logic
- Consider adding examples or screenshots if applicable

## Questions?

If you have any questions about contributing, feel free to open an issue.

Thank you for helping make PromptMask better!
