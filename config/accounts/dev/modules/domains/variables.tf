locals {
  common_tags = {
    ProvisionedBy = "terraform"
  }
}

variable "namespace" {
  type    = string
  default = "storyverse"
}
