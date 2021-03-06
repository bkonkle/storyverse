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
