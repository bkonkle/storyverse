module "label_api_dev" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.24.1"
  namespace = var.namespace
  stage     = "dev"
  name      = "api"
  tags      = local.common_tags
  delimiter = "-"
}

resource "aws_acm_certificate" "api_dev" {
  domain_name       = "${var.namespace}-api-dev.deterministic.dev"
  validation_method = "DNS"

  tags = module.label_api_dev.tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "api_dev_validation" {
  for_each = {
    for options in aws_acm_certificate.api_dev.domain_validation_options : options.domain_name => {
      name   = options.resource_record_name
      record = options.resource_record_value
      type   = options.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.deterministic_dev.zone_id
}

resource "aws_acm_certificate_validation" "api_dev_validation" {
  certificate_arn         = aws_acm_certificate.api_dev.arn
  validation_record_fqdns = aws_route53_record.api_dev_validation.*.fqdn
}
