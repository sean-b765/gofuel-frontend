# GoFuel

> Project: gofuel

[Demo](https://gofuel.seanboaden.dev/)

- `React.js`
- State management: `zustand`
- UI: `mui`

**Third-Party**

- `react-mapbox-gl`

## `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

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

Also set app secrets `REACT_APP_BASE_URL` and `REACT_APP_MAPBOX_KEY`.

Finally, create a CNAME for `gofuel.seanboaden.dev` -> the `cloudfront_domain_name` output (DNS lives in Cloudflare).
