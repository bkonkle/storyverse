output "access_key_id" {
  value = aws_iam_access_key.root.id
}

output "secret_access_key" {
  value = aws_iam_access_key.root.secret
}
