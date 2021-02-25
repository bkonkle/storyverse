# AWS Notes

## Account Setup

### Bootstrapping

To build a new account from scratch, first create a "storyverse-root" IAM user to create the initial S3 bucket and DynamoDB table for Terraform state. Save the access key details to `~/.aws/credentials` like this:

```ini
[storyverse-root]
aws_access_key_id = <key id>
aws_secret_access_key = <access key>
```

Add an Inline Policy called "storyverse-bootstrap" to the user giving it control over the Terraform state bucket and DynamoDB lock table using this json:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::storyverse-<account-name>-tf-state"
    },
    {
      "Effect": "Allow",
      "Action": "dynamodb:*",
      "Resource": "arn:aws:dynamodb:us-west-2:<account-id>:table/storyverse-tf-locks"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreatePolicy",
        "iam:GetPolicy",
        "iam:GetPolicyVersion",
        "iam:ListPolicyVersions",
        "iam:ListEntitiesForPolicy"
      ],
      "Resource": "arn:aws:iam::<account-id>:policy/storyverse-root-access"
    },
    {
      "Effect": "Allow",
      "Action": ["iam:AttachUserPolicy", "iam:DetachUserPolicy"],
      "Resource": "arn:aws:iam::<account-id>:user/storyverse-root"
    }
  ]
}
```

Replace `<account-name>` with a name for this account - such as "dev" - to differentiate with other accounts in the same region.

Replace `<account-id>` with the id of the account you're provisioning.

Then, navigate to the `config/accounts/bootstrap` directory and run:

```sh
terraform init
AWS_PROFILE=bootstrap terraform apply
```

Use the same name for the `account_name` variable that you used for `<account-name>` above.

This will add some new permissions to the

### Account Configuration

Next

## Environment Setup

To set up a new environment, navigate to the `config/environments/<env>` directory (replacing `<env>` with the tag for the new environment you want to set up).

## Local Development

To gain access to dev resources
