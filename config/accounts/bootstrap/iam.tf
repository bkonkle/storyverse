module "label_iam" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.24.1"
  namespace = var.namespace
  name      = "root"
  tags      = local.common_tags
  delimiter = "-"
}

data "aws_route53_zone" "deterministic_dev" {
  name = "deterministic.dev."
}

resource "aws_iam_policy" "policy" {
  name        = "${module.label_iam.id}-access"
  path        = "/"
  description = "${var.namespace} root account access for ${var.account_name}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:*"]
        Resource = ["arn:aws:s3:::storyverse-${var.account_name}-*"]
      },
      {
        Effect   = "Allow"
        Action   = ["route53:ListHostedZones"]
        Resource = [data.aws_route53_zone.deterministic_dev.zone_id]
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "policy_attach" {
  name       = "${module.label_iam.id}-access"
  users      = [var.root_user]
  policy_arn = aws_iam_policy.policy.arn
}
