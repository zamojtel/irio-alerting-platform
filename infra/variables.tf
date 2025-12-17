variable "db_user" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "project_id" {
  type    = string
  default = "leafy-tenure-475014-a1"
}

variable "region" {
  type    = string
  default = "europe-west1"
}
