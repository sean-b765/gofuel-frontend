variable "project" {
  description = "Project name used for resource naming and tagging"
  type        = string
  default     = "gofuel"
}

variable "environment" {
  description = "Environment name used for tagging and resource naming"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Custom hostname (CNAME) applied to the CloudFront distribution. Must be covered by acm_certificate_arn. Point a DNS CNAME at the cloudfront_domain_name output."
  type        = string
  default     = "gofuel.seanboaden.dev"
}

variable "acm_domain" {
  description = "Domain of the existing ACM certificate (must be in us-east-1) to look up for the CloudFront custom domain."
  type        = string
  default     = "seanboaden.dev"
}

