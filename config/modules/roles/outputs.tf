output "root_access_key" {
  value = {
    id     = aws_iam_access_key.root.id
    secret = aws_iam_access_key.root.secret
  }
}
