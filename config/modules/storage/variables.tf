variable "namespace" {
  type    = string
  default = "storyverse"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "name" {
  type    = string
  default = "storage"
}

variable "aws_iam_role_names" {
  type        = array(string)
  description = "The IAM role names to give access to this bucket"
}
