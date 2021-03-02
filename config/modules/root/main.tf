module "label" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.24.1"
  namespace = var.namespace
  name      = "root"
  tags      = local.common_tags
  delimiter = "-"
}

resource "aws_iam_user" "root" {
  name = module.label.id
  tags = module.label.tags
}

resource "aws_iam_access_key" "root" {
  user = aws_iam_user.root.name
}

resource "aws_iam_policy" "root" {
  name        = "${module.label.id}-access"
  path        = "/"
  description = "${var.namespace} root account access for dev"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "dynamodb:*"
        Resource = "arn:aws:dynamodb:${var.region}:${local.account_id}:table/${var.namespace}-tf-locks"
      },
      {
        Effect   = "Allow"
        Action   = "s3:*"
        Resource = "arn:aws:s3:::${var.namespace}-dev-*"
      },
      {
        Effect = "Allow"
        Action = [
          "route53:ListResourceRecordSets",
          "route53:ChangeResourceRecordSets",
          "route53:GetHostedZone",
          "route53:ListHostedZones",
          "route53:ListTagsForResource",
          "route53:GetChange",
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "acm:DescribeCertificate",
          "acm:RequestCertificate",
          "acm:DeleteCertificate",
          "acm:ListTagsForCertificate",
          "acm:AddTagsToCertificate",
        ],
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = "iam:*"
        Resource = [
          "arn:aws:iam::${local.account_id}:policy/${var.namespace}-*",
          "arn:aws:iam::${local.account_id}:role/${var.namespace}-*",
          "arn:aws:iam::${local.account_id}:group/${var.namespace}-*",
        ]
      },
    ]
  })
}

resource "aws_iam_policy_attachment" "policy_attach" {
  name       = "${module.label.id}-access"
  users      = [aws_iam_user.root.name]
  policy_arn = aws_iam_policy.root.arn
}
