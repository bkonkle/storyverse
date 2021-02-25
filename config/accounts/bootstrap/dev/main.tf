provider "aws" {
  region = var.region
}

# Create a locking table for terraform runs
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "${var.namespace}-tf-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}

# Create a state bucket for terraform
resource "aws_s3_bucket" "terraform_state" {
  bucket = "${var.namespace}-dev-tf-state"

  lifecycle {
    prevent_destroy = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

