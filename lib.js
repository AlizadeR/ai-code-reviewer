# Save this file as .github/workflows/ai-review.yml in any repo you want reviewed.
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: AI Code Reviewer
        uses: your-username/ai-code-reviewer@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          nvidia-api-key: ${{ secrets.NVIDIA_API_KEY }}
          # optional overrides:
          # model: qwen/qwen3-coder-480b-a35b-instruct
          # max-diff-lines: '400'
          # exclude-patterns: '*.lock,dist/**,*.min.js,package-lock.json'
