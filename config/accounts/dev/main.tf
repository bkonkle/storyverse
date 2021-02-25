provider "aws" {
  region = var.region
}

data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
}

terraform {
  backend "s3" {
    bucket         = "storyverse-dev-tf-state"
    dynamodb_table = "storyverse-tf-locks"
    key            = "accounts/dev/terraform.tfstate"
    region         = "us-west-2"
  }
}

module "domains" {
  source    = "./modules/domains"
  namespace = var.namespace
}
