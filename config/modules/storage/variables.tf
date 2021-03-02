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

variable "groups" {
  description = "The IAM group names to give access to this bucket"
  type        = list(string)
  default = []
}
