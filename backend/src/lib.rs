use axum::{Json, Router, response::IntoResponse, routing::get};
use serde_json::json;

pub fn app() -> Router {
    Router::new().route("/health", get(health))
}

async fn health() -> impl IntoResponse {
    Json(json!({"status": "ok"}))
}
