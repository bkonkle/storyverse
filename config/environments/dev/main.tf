provider "aws" {
  region = var.region
}

data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
}

terraform {
  backend "s3" {
    bucket         = "storyverse-${local.account_id}-tf-state"
    dynamodb_table = "storyverse-tf-locks"
    key            = "environments/dev/terraform.tfstate"
    region         = var.region
  }
}

module "storage" {
  source      = "../modules/storage"
  namespace   = var.namespace
  environment = var.environment
}
