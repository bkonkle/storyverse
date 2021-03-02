module "label_developers" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.24.1"
  namespace = var.namespace
  name      = "developers"
  tags      = local.common_tags
  delimiter = "-"
}

resource "aws_iam_group" "developers" {
  name = module.label_developers.id
}

resource "aws_iam_policy" "developers" {
  name        = module.label_developers.id
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
    ]
  })
}

resource "aws_iam_group_policy_attachment" "developers" {
  group      = aws_iam_group.developers.name
  policy_arn = aws_iam_policy.developers.arn
}

resource "aws_iam_group_policy_attachment" "developers_self_managed" {
  group      = aws_iam_group.developers.name
  policy_arn = aws_iam_policy.self_managed.arn
}
