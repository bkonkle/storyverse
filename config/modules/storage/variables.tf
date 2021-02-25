locals {
  common_tags = {
    ProvisionedBy = "terraform"
  }
}

variable "namespace" {
  type    = string
  default = "storyverse"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "aws_iam_role_names" {
  type        = list(string)
  description = "The IAM role names to give access to this bucket"
}
