module "label_storage" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.24.1"
  namespace = var.namespace
  stage     = var.environment
  name      = "storage"
  tags      = local.common_tags
  delimiter = "-"
}

# Create a state bucket for terraform
resource "aws_s3_bucket" "storage" {
  bucket = module.label_storage.id
  tags   = module.label_storage.tags
}
