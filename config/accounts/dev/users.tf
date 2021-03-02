module "groups" {
  source    = "../../modules/groups"
  region    = var.region
  namespace = var.namespace
}


module "user_bkonkle" {
  source        = "../../modules/user"
  username      = "bkonkle"
  login_profile = true
  pgp_key       = "keybase:bkonkle"
  groups        = [module.groups.developers]
}
