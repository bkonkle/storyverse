module "label_developers_role" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.24.1"
  namespace = var.namespace
  name      = "developer"
  tags      = local.common_tags
  delimiter = "-"
}

module "label_developers_group" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.24.1"
  namespace = var.namespace
  name      = "developers"
  tags      = local.common_tags
  delimiter = "-"
}


resource "aws_iam_role" "developer" {
  name = module.label_developers_role.id
  tags = module.label_developers_role.tags

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

resource "aws_iam_group" "developers" {
  name = module.label_developers_group.id
}

resource "aws_iam_group_policy" "developers" {
  name  = module.label_developers_group.id
  group = aws_iam_group.developers.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "sts:AssumeRole"
        Resource = aws_iam_role.developer.arn
      }
    ]
  })
}

resource "aws_iam_policy" "developers" {
  name        = module.label_developers_role.id
  path        = "/"
  description = "general developer access for ${var.namespace}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:ListAllMyBuckets"]
        Resource = ["*"]
      },
      {
        Effect = "Allow"
        Action = [
          "iam:List*",
          "iam:GetAccountPasswordPolicy",
          "iam:GetAccountSummary",
        ]
        Resource = ["*"]
      },
      {
        Effect = "Allow"
        Action = ["iam:Get*"]
        Resource = [
          "arn:aws:iam::${local.account_id}:role/storyverse-*",
          "arn:aws:iam::${local.account_id}:group/storyverse-*",
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "iam:Get*",
          "iam:List*",
          "iam:Generate*",
          "iam:*SSH*",
          "iam:ChangePassword",
          "iam:*AccessKey*",
          "iam:CreateLoginProfile",
          "iam:CreateVirtualMFADevice",
          "iam:DeleteLoginProfile",
          "iam:DeleteVirtualMFADevice",
          "iam:EnableMFADevice",
          "iam:ResyncMFADevice",
          "iam:UpdateLoginProfile",
          "iam:UpdateUser",
          "iam:UploadSigningCertificate",
        ]
        Resource = [
          "arn:aws:iam::*:user/*/$${aws:username}",
          "arn:aws:iam::*:user/$${aws:username}",
          "arn:aws:iam::*:mfa/$${aws:username}"
        ]
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "developers" {
  name       = module.label_developers_role.id
  roles      = [aws_iam_role.developer.name]
  policy_arn = aws_iam_policy.developers.arn
}
