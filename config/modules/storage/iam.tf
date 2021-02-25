resource "aws_iam_policy" "policy" {
  name        = module.label_storage.id
  path        = "/"
  description = "storage S3 bucket access for ${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "s3:ListBucket"
        Resource = "arn:aws:s3:::${module.label_storage.id}"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:PutObjectAcl"
        ]
        Resource = "arn:aws:s3:::${module.label_storage.id}/*"
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "policy_attach" {
  name       = module.label_storage.id
  roles      = var.aws_iam_role_names
  policy_arn = aws_iam_policy.policy.arn
}
