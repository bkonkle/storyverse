module "label_self_managed" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.24.1"
  namespace = var.namespace
  name      = "self-managed"
  tags      = local.common_tags
  delimiter = "-"
}

resource "aws_iam_policy" "self_managed" {
  name        = module.label_self_managed.id
  path        = "/"
  description = "access to manage own user and read all IAM resources"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "iam:ChangePassword",
          "iam:CreateAccessKey",
          "iam:CreateLoginProfile",
          "iam:CreateVirtualMFADevice",
          "iam:DeleteAccessKey",
          "iam:DeleteLoginProfile",
          "iam:DeleteVirtualMFADevice",
          "iam:EnableMFADevice",
          "iam:GenerateCredentialReport",
          "iam:GenerateServiceLastAccessedDetails",
          "iam:Get*",
          "iam:List*",
          "iam:ResyncMFADevice",
          "iam:UpdateAccessKey",
          "iam:UpdateLoginProfile",
          "iam:UpdateUser",
          "iam:UploadSigningCertificate",
          "iam:UploadSSHPublicKey",
        ]
        Resource = [
          "arn:${data.aws_partition.current.partition}:iam::${local.account_id}:user/*/$${aws:username}",
          "arn:${data.aws_partition.current.partition}:iam::${local.account_id}:user/$${aws:username}",
          "arn:${data.aws_partition.current.partition}:iam::${local.account_id}:mfa/$${aws:username}",
        ]
      },
      {
        Effect   = "Allow"
        Action   = ["iam:Get*", "iam:List*"]
        Resource = ["*"]
      },

      # Allow to deactivate MFA only when logging in with MFA
      {
        Effect = "Allow"
        Action = ["iam:DeactivateMFADevice"]
        Resource = [
          "arn:${data.aws_partition.current.partition}:iam::${local.account_id}:user/*/$${aws:username}",
          "arn:${data.aws_partition.current.partition}:iam::${local.account_id}:user/$${aws:username}",
          "arn:${data.aws_partition.current.partition}:iam::${local.account_id}:mfa/$${aws:username}",
        ]
        Condition = {
          Bool            = { "aws:MultiFactorAuthPresent" = "true" },
          NumericLessThan = { "aws:MultiFactorAuthAge" = "3600" },
        }
      }
    ]
  })
}
