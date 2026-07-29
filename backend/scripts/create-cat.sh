#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:8080/api/v1/cats}"

curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Minou",
    "date_of_birth": "2020-03-15",
    "breed": "European Shorthair",
    "sex": "Female",
    "color": "black",
    "weight": 4.5,
    "diabetes": true,
    "food_per_ration": 50.0,
    "food_name": "Royal Canin Diabetic"
  }' | jq .
