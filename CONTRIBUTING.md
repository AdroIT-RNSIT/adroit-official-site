# Contributing to AdroIT Cloud Computing Project

Thank you for your interest in contributing! This guide covers everything you need to get started — from setting up your environment to submitting a pull request.

Please read this document fully before opening any issues or pull requests.

---

## Before You Start

- Read the `README.md` completely.
- Make sure your environment meets the prerequisites listed below.
- Check open issues and pull requests to avoid duplicating work.
- If you plan to work on something significant, open an issue first to discuss it with the team.

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- A code editor (VS Code recommended)

---

## Setup Instructions

**1. Fork the repository**

Click the **Fork** button at the top right of the repository page to create your own copy.

**2. Clone your fork**

```bash
git clone https://github.com/<your-username>/adroit-official-site.git
cd adroit-official-site
```

**3. Add the upstream remote**

This keeps your fork in sync with the original repository.

```bash
git remote add upstream https://github.com/AdroIT-RNSIT/adroit-official-site.git
```

**4. Install dependencies**

```bash
cd frontend
npm install
```

**5. Start the development server**

```bash
npm run dev
```

The app should now be running at `http://localhost:3000` (or whichever port is shown in the terminal).

---

## Keeping Your Fork Up to Date

Before starting any new work, always sync with the latest changes from upstream:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

---

## Branching Strategy

Never commit directly to `main`. All changes must go through a branch and a pull request.

Create a new branch for every piece of work you do:

```bash
git checkout -b <type>/<short-description>
```

**Branch naming conventions:**

| Prefix | Use for |
|---|---|
| `feature/<name>` | New features or enhancements |
| `fix/<name>` | Bug fixes |
| `docs/<name>` | Documentation updates |
| `refactor/<name>` | Code restructuring without behavior changes |

**Examples:**

```bash
git checkout -b feature/team-page
git checkout -b fix/navbar-overlap
git checkout -b docs/update-setup-guide
```

Branch names must be lowercase and hyphen-separated.

---

## Commit Guidelines

Write clear, structured commit messages so the history stays readable.

**Format:**

```
type: short description in lowercase
```

**Allowed types:**

| Type | Use for |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `refactor` | Code restructuring |
| `style` | Formatting, whitespace (no logic changes) |
| `chore` | Maintenance, config, tooling |

**Examples:**

```
feat: add team section layout
fix: resolve navbar overlap on mobile
docs: update frontend setup instructions
style: reformat hero component
```

Avoid vague messages like `update`, `fix`, or `changes`.

---

## Pull Request Process

**Before opening a PR, check the following:**

- [ ] Code builds successfully (`npm run dev` runs without errors)
- [ ] No console errors or warnings introduced
- [ ] Follows the existing project structure
- [ ] Tested locally across relevant screen sizes (if UI change)
- [ ] No unrelated files modified
- [ ] No unnecessary packages added

**Steps to submit:**

1. Push your branch to your fork:

```bash
git push origin <your-branch-name>
```

2. Go to your fork on GitHub and click **Compare & pull request**.

3. Fill out the PR description with:
   - What was changed
   - Why it was needed
   - Screenshots (required for any UI changes)
   - Related issue number, if applicable (e.g. `Closes #42`)

4. Wait for a review. A maintainer will leave feedback or approve and merge your PR.

> **Note:** You will not be able to merge your own pull request. Do not request a review from someone who worked on the same change.

---

## Project Structure

```
adroit-official-site/
├── frontend/          # All frontend code lives here
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

- Keep all frontend code inside `/frontend`.
- A `/backend` directory will be introduced in a future phase — do not create it yourself.
- Do not modify files outside the scope of your change.
- Avoid adding dependencies unless clearly necessary — if unsure, mention it in your PR.

---

## Coding Standards

- Write readable, modular code with meaningful variable and function names.
- Follow the existing folder structure and file naming patterns.
- Keep components focused — one responsibility per component.
- Maintain consistent formatting. Run your editor's formatter before committing.
- Do not leave commented-out code in your commits.

---

## Reporting Issues

When opening an issue, include:

- A clear, specific title
- A description of the problem
- Steps to reproduce it
- What you expected to happen vs. what actually happened
- Screenshots or error messages if applicable
- Your environment (OS, Node version, browser)

Check existing issues before opening a new one.

---

## Security

Never commit the following:

- API keys or tokens
- Passwords or secrets
- `.env` files or any environment configuration
- Any credentials of any kind

If you accidentally commit sensitive information, contact a maintainer immediately.

---

## Code of Conduct

- Keep all feedback technical and constructive.
- Respect differing opinions and approaches.
- Assume good intent from other contributors.
- Harassment or disrespectful behaviour of any kind will not be tolerated.

---

Thank you for contributing to AdroIT!  
If you have any questions not covered here, open an issue or reach out to a maintainer.
