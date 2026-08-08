output "gha_deploy_role_arn" {
  description = "IAM role ARN for GitHub Actions OIDC. Set as GitHub secret AWS_DEPLOY_ROLE_ARN."
  value       = aws_iam_role.deploy.arn
}

output "s3_bucket" {
  description = "S3 static site bucket name. Set as GitHub secret S3_BUCKET."
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for invalidations. Set as GitHub secret CF_DIST_ID."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront default domain (dXXXXXX.cloudfront.net). Create a DNS CNAME from var.domain_name to this."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "website_url" {
  description = "Final custom-domain URL once DNS is configured."
  value       = "https://${var.domain_name}"
}