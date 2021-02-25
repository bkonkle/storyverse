locals {
  common_tags = {
    ProvisionedBy = "terraform"
  }
}

variable "region" {
  type    = string
  default = "us-west-2"
}

variable "namespace" {
  type    = string
  default = "storyverse"
}

variable "account_name" {
  type        = string
  description = "The name of the AWS account to bootstrap"
}

variable "root_user" {
  type = string
  default = "storyverse-root"
}
