resource "aws_iam_policy" "policy" {
  name        = module.label.id
  path        = "/"
  description = "storage S3 bucket access for ${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "s3:ListBucket"
        Resource = "arn:aws:s3:::${module.label.id}"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:PutObjectAcl"
        ]
        Resource = "arn:aws:s3:::${module.label.id}/*"
      }
    ]
  })
}

resource "aws_iam_group_policy_attachment" "developers" {
  for_each = toset(var.groups)

  group      = each.key
  policy_arn = aws_iam_policy.policy.arn
}
