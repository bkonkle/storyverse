module "label_iam" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.24.1"
  namespace = var.namespace
  name      = "developer"
  tags      = local.common_tags
  delimiter = "-"
}

resource "aws_iam_role" "developer" {
  name = module.label_iam.id
  tags = module.label_iam.tags

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "sts:AssumeRole"
        Principal = {
          AWS = "arn:aws:iam::${local.account_id}:root"
        }
      },
    ]
  })
}
