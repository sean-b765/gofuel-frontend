# AGENTS.md
# Project: gofuel

## Stack
- Create React App (`react-scripts build` -> `build/`)
- Deploy: GitHub Actions -> S3 + CloudFront (no Amplify)
- Infra: Terraform in `infrastructure/`, applied locally

## Commands
- `npm run build` - production build to `build/`
- `npm test` - run tests
- `npm start` - dev server
- Infra (`infrastructure/`):
  - `terraform init` then `terraform apply` (run locally, state is gitignored)
  - `terraform fmt -recursive` - format check
  - `terraform validate` - validate config

## Required GitHub repo secrets (after first `terraform apply`)
Set from `terraform output -raw <name>`:

| Secret                  | terraform output             |
|-------------------------|------------------------------|
| `AWS_DEPLOY_ROLE_ARN`   | `gha_deploy_role_arn`        |
| `S3_BUCKET`             | `s3_bucket`                  |
| `CF_DIST_ID`            | `cloudfront_distribution_id` |

Plus app secrets `REACT_APP_BASE_URL`, `REACT_APP_MAPBOX_KEY`.

## Lint / typecheck
CRA default eslint config is wired via `react-scripts` (`extends: react-app`).
No separate lint/typecheck scripts are defined in `package.json`.