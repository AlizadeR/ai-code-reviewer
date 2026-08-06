# AI Code Reviewer

A GitHub Action that automatically reviews pull requests using an AI model
hosted for free on [NVIDIA NIM](https://build.nvidia.com/models) (OpenAI-compatible API).

On every PR, it:
1. Fetches the diff for each changed file
2. Sends each file's diff to the model for review (bugs, security issues, real maintainability problems)
3. Posts a single summary comment on the PR

## 1. Get an NVIDIA NIM API key (free)

1. Go to https://build.nvidia.com, sign up for the free Developer Program (no credit card)
2. Generate an API key (starts with `nvapi-...`)
3. Pick a model from the catalog — good defaults for code review:
   - `qwen/qwen3-coder-480b-a35b-instruct` (strong on code)
   - `deepseek-ai/deepseek-v3.1`

Free tier is rate-limited (roughly ~40 requests/minute) — fine for personal repos
and small teams, not for high-traffic production use.

## 2. Use it in a repo

Add `NVIDIA_API_KEY` as a repo secret:
`Settings → Secrets and variables → Actions → New repository secret`

Then add `.github/workflows/ai-review.yml` (see `examples/ai-review.yml` in this repo):

```yaml
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
```

## 3. Local development

```bash
npm install
npm run build   # bundles src/index.js -> dist/index.js via @vercel/ncc
```

GitHub Actions runs `dist/index.js` directly (see `action.yml`), so you must
run `npm run build` and commit `dist/` before tagging a release.

## 4. Publishing as a reusable Action (so others can use it)

1. Push this repo to GitHub as `your-username/ai-code-reviewer`
2. Commit the built `dist/` folder (Actions needs the bundled file, not raw source)
3. Tag a release: `git tag v1 && git push origin v1`
4. (Optional) List it on the GitHub Marketplace from the repo's release page —
   this is how people discover it organically, no ads/marketing spend needed

## Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `github-token` | yes | — | Usually `secrets.GITHUB_TOKEN` |
| `nvidia-api-key` | yes | — | Your NVIDIA NIM API key |
| `model` | no | `qwen/qwen3-coder-480b-a35b-instruct` | Any chat model from the NIM catalog |
| `max-diff-lines` | no | `400` | Truncates huge diffs per file to control cost/rate limits |
| `exclude-patterns` | no | `*.lock,dist/**,*.min.js,...` | Comma-separated globs to skip |

## Monetization notes (for future you)

- Free tier NIM rate limit (~40 req/min) is fine for open-source / personal use.
  A paid tier of this action would need either a paid NIM/DGX endpoint, or a
  proxy you host and charge for (so you eat the API cost, not the user).
- Realistic pricing model: free for public repos, paid ($9–19/mo per repo or per seat)
  for private repos/teams — this is the standard pattern for GitHub Marketplace apps.
- Weekly maintenance you'll actually need: watch NIM rate-limit/model deprecation
  notices, monitor failed review runs (Action logs), adjust prompt if reviews get noisy.
