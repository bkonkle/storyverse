output "root_access_key" {
  value = module.root.access_key
}

output "groups" {
  value = module.groups
}

output "users" {
  value = {
    bkonkle = module.user_bkonkle.login_profile
  }
}
