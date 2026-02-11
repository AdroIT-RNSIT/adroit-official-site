# 🤝 Contributing Guide

Thank you for contributing to the AdroIT Cloud Computing Project.
This document explains the workflow, coding standards, and collaboration process to ensure consistent development.

---

## 📌 Before You Start

Please:

* Read the README.md completely.
* Ensure your environment meets the prerequisites.
* Pull the latest changes from `main` before starting work.

```
git pull origin main
```

---

## 📥 Setup Instructions

Clone the repository:

```
git clone https://github.com/AdroIT-RNSIT/adroit-official-site.git
cd adroit-official-site
```

Frontend setup:

```
cd frontend
npm install
npm run dev
```

---

## 🌿 Branching Strategy

Do NOT commit directly to `main`.

Create a new branch for every change.

### Branch naming conventions:

* feature/<feature-name>
* fix/<bug-name>
* docs/<documentation-update>
* refactor/<refactor-description>

Example:

```
git checkout -b feature/team-page
```

---

## 📝 Commit Guidelines

Use clear, structured commit messages.

Format:

```
type: short description
```

Allowed types:

* feat: new feature
* fix: bug fix
* docs: documentation changes
* refactor: code restructuring
* style: formatting changes
* chore: maintenance tasks

Example:

```
feat: add team section layout
```

---

## 🔁 Pull Request Process

Before creating a Pull Request:

* [ ] Code builds successfully
* [ ] No console errors
* [ ] Follows project structure
* [ ] Tested locally

Steps:

1. Push your branch:

```
git push origin your-branch-name
```

2. Open a Pull Request.
3. Add a clear description of:

   * What changed
   * Why it was needed
   * Screenshots (if UI changes)

---

## 🧩 Project Structure Rules

* Frontend code must stay inside `/frontend`.
* Backend code will be added later under `/backend`.
* Do not modify unrelated files.
* Avoid unnecessary dependencies.

---

## 🎨 Coding Standards

* Write readable and modular code.
* Use meaningful variable and function names.
* Follow existing folder structure.
* Maintain consistent formatting.

---

## 🐛 Reporting Issues

When opening an issue, include:

* Clear title
* Description
* Steps to reproduce
* Expected vs actual behaviour
* Screenshots (if applicable)

---

## 🔒 Security

Do not commit:

* API keys
* Secrets
* Environment files (.env)

---

## 🙌 Code of Conduct

Be respectful and collaborative. Constructive feedback is encouraged.

---

Thank you for contributing!
