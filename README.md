![Build Status](https://img.shields.io/github/actions/workflow/status/jefeish/merge-guard-app/ci.yml?branch=main)
![License](https://img.shields.io/github/license/jefeish/merge-guard-app)
![Version](https://img.shields.io/github/v/release/jefeish/merge-guard-app)
![Languages](https://img.shields.io/github/languages/top/jefeish/merge-guard-app)
![Repo Size](https://img.shields.io/github/repo-size/jefeish/merge-guard-app)

# Merge Guard App

A GitHub Probot app that enforces merge commit comment standards.

## Introduction

This app ensures that pull requests merges include key information, like a JIRA ticket ID, in the `merge-commit` message. 

Developers might include this info in individual commits, but it’s not guaranteed to appear in the final `merge-commit`. 
By default, GitHub uses the PR title as the `merge-commit` message, but if the PR has multiple commits, the branch name is used instead. 
This app validates that the `merge-commit` includes the required information, and can block merges if the check fails, enforcing this rule via branch protection.

### NOTE: This app provides an alternative solution to using GitHub Actions.


