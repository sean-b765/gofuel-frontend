# AGENTS.md
# Project: gofuel

## Stack
- React Router framework (Vite) — SPA mode (`ssr: false`)
- Deploy: GitHub Actions -> S3 + CloudFront (no Amplify)
- Infra: Terraform in `infrastructure/`, applied locally

## Commands
- `npm run dev` - dev server
- `npm run build` - production build to `build/client/`
- `npm run typecheck` - typecheck (runs `react-router typegen` then `tsc`)
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

Plus app secrets `VITE_BASE_URL`, `VITE_MAPBOX_KEY`.

## Lint / typecheck
- No lint script configured; TypeScript typecheck via `npm run typecheck`.
- CRA `extends: react-app` eslint config removed during Vite migration.