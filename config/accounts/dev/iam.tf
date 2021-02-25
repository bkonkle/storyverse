module "label_role" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.24.1"
  namespace = var.namespace
  name      = "developer"
  tags      = local.common_tags
  delimiter = "-"
}

module "label_group" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.24.1"
  namespace = var.namespace
  name      = "developers"
  tags      = local.common_tags
  delimiter = "-"
}

resource "aws_iam_role" "developer" {
  name = module.label_role.id
  tags = module.label_role.tags

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

resource "aws_iam_policy" "policy" {
  name        = module.label_role.id
  path        = "/"
  description = "general access for ${var.namespace}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "s3:ListAllMyBuckets"
        Resource = "arn:aws:s3:::*"
      },
      {
        Effect   = "Allow"
        Action   = "iam:ListUsers"
        Resource = "arn:aws:iam::${local.account_id}:user/"
      },
      {
        Effect   = "Allow"
        Action   = "iam:ListRoles"
        Resource = "arn:aws:iam::${local.account_id}:role/"
      },
      {
        Effect   = "Allow"
        Action   = "iam:ListGroups"
        Resource = "arn:aws:iam::${local.account_id}:group/"
      },
      {
        Effect   = "Allow"
        Action   = ["iam:GetGroup", "iam:ListGroupPolicies", "iam:ListAttachedGroupPolicies", "iam:ListGroupTags"]
        Resource = "arn:aws:iam::${local.account_id}:group/storyverse-*"
      },
      {
        Effect   = "Allow"
        Action   = ["iam:GetRole", "iam:ListRolePolicies", "iam:ListAttachedRolePolicies", "iam:ListRoleTags"]
        Resource = "arn:aws:iam::${local.account_id}:role/storyverse-*"
      },
      {
        Effect = "Allow"
        Action = [
          "iam:GetUser",
          "iam:ListUserPolicies",
          "iam:ListGroupsForUser",
          "iam:ListUserTags",
        ]
        Resource = "arn:aws:iam::${local.account_id}:user/$${aws:username}"
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "policy_attach" {
  name       = module.label_role.id
  roles      = [aws_iam_role.developer.name]
  policy_arn = aws_iam_policy.policy.arn
}

resource "aws_iam_group" "developers" {
  name = module.label_group.id
}

resource "aws_iam_group_policy" "developers" {
  name  = module.label_group.id
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
