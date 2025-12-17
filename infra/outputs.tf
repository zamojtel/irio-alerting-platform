output "load_balancer_ip" {
  value = google_compute_global_forwarding_rule.http_forwarding_rule.ip_address
}

output "bucket_name" {
  value = google_storage_bucket.static_assets.name
}

output "registry_url" {
  value = google_artifact_registry_repository.docker_registry.registry_uri
}
