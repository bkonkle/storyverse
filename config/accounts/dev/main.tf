provider "aws" {
  region = var.region
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
  source    = "../../modules/domains/dev"
  namespace = var.namespace
}

module "roles" {
  source    = "../../modules/roles"
  region    = var.region
  namespace = var.namespace
}
