# AWS Notes

## Bootstrapping

To build a new account from scratch, first create a `<account-name>-root` IAM user to act as the "superadmin" for the account. Replace `<account-name>` with a name for this account - such as "dev". Pick "AdministratorAccess" from the "Set permissions" interface, and save the access key details to `~/.aws/credentials` like this:

```ini
[dev-root]
aws_access_key_id = <key id>
aws_secret_access_key = <access key>
```

These are the "keys to the kingdom" for this account, and should be guarded as such.

Then, navigate to the `config/accounts/bootstrap/<account-name>` directory and run:

```sh
AWS_PROFILE=dev-root terraform init
AWS_PROFILE=dev-root terraform apply
```

Use the same name for the `account_name` variable that you used for `<account-name>` above.

The bootstrap config will create an initial S3 bucket and DynamoDB table for Terraform state. The local state it creates is able to be thrown away, because this only needs to be done once per account. Once the bucket and table are in place, there's no longer a need to bootstrap.

## Account Setup

Now, it's time to initialize the resources shared across all environments within this namespace on the account. AWS accounts are divided between multiple namespaces - such as "storyverse" - which each can have multiple environments - such as "dev". Navigate to the `config/environments/bootstrap` directory and run:

```sh
AWS_PROFILE=dev-root terraform init
AWS_PROFILE=dev-root terraform apply
```

This will create a new `storyverse-root` IAM user for this namespace, and give it the necessary permissions for storyverse resources. You should see a `root_access_key` `id` and `secret` in the outputs. Save them to `~/.aws/credentials` like this:

```ini
[storyverse-root]
aws_access_key_id = <id>
aws_secret_access_key = <secret>

```

## Environment Setup

Now it's time to switch to the `storyverse-root` user. To set up a new environment, navigate to the `config/environments/<env>` directory (replacing `<env>` with the tag for the new environment you want to set up, such as "dev").

```sh
AWS_PROFILE=storyverse-root terraform init
AWS_PROFILE=storyverse-root terraform apply
```

This will use the storyverse-root user to create resources for the environment.

## Local Development

To grant access to local development resources to a new team member, add a "modules/user" entry for the new user at `config/accounts/<account-name>/users.tf`:

```tf
module "user_myusername" {
  source        = "../../modules/user"
  username      = "myusername"
  login_profile = true
  pgp_key       = "keybase:myusername"
}
```

Pair this with a new key in the "users" output value, so that you can share the user's new encrypted password with them:

```tf
output "users" {
  value = {
    # ...
    myusername = module.user_myusername.login_profile
  }
}
```

The username will be prefixed with the namespace, like "storyverse-bkonkle". To decode the new password, have the user use the Keybase app like this:

```sh
echo "<password>" | base64 --decode | keybase pgp decrypt
```

Alternatively, if you have a key saved in `gpg`, decrypt it like this:

```sh
echo "<password>" | base64 --decode | gpg -qd
```

Replace `<password>` with the value from the "users" output for that user.

Once the user and login profile are created, have the new user visit the AWS console login url for your AWS account with their username and decrypted password. For example: [https://534904279422.signin.aws.amazon.com/console](https://534904279422.signin.aws.amazon.com/console)

The user will need to set a new password upon gaining access to the account.

Then, have the user create an Access Key for their new account by visiting their user in the AWS console under IAM, clicking on the "Security credentials" tab, and clicking the "Create access key" button.
