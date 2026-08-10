# GoFuel

> Project: gofuel

[Demo](https://gofuel.seanboaden.dev/)

- `React.js` (React Router framework + Vite)
- State management: `zustand`
- UI: `mui`

**Third-Party**

- `mapbox-gl`

## `npm run dev`

Runs the app in development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.

## `npm run build`

Builds the app for production to `build/client/`.

## Deployment

Static hosting on S3 + CloudFront.

- **Build/Deploy**: GitHub Actions (`.github/workflows/deploy.yml`) on push to `master`.
- **Auth**: GitHub OIDC -> IAM role, no static AWS keys.
- **Infra**: Terraform in `infrastructure/`.

### One-time bootstrap

```bash
cd infrastructure
terraform init
terraform apply
```

Then set these GitHub repo secrets from the terraform outputs:

| Secret                | Output                       |
| --------------------- | ---------------------------- |
| `AWS_DEPLOY_ROLE_ARN` | `gha_deploy_role_arn`        |
| `S3_BUCKET`           | `s3_bucket`                  |
| `CF_DIST_ID`          | `cloudfront_distribution_id` |

Also set app secrets `VITE_BASE_URL` and `VITE_MAPBOX_KEY`.

Finally, create a CNAME for `gofuel.seanboaden.dev` -> the `cloudfront_domain_name` output (DNS lives in Cloudflare).
