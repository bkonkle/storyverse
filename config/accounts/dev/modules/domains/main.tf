# dev/modules/domains
# -------------------
#
# Define domains for all environments within the dev account

data "aws_route53_zone" "deterministic_dev" {
  name = "deterministic.dev."
}
