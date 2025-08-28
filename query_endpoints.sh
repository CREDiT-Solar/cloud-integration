#!/bin/bash

# List of endpoints
endpoints=(
  "historical_solar_prod"
  "solar_energy_totals"
  "battery_percentage_timeseries"
  "grid_self_consumption"
  "grid_status"
  "solar_energy_usage"
  "solar_energy_total"
  "solar_prod_sum"
)

# List of periods
periods=("hour" "day" "24-hour" "week" "month" "year")

# Output file
outfile="endpoint_results.txt"

# Clear file before writing
> "$outfile"

# Base URL of your API
base_url="http://localhost:5000"

# Loop through endpoints and periods
for endpoint in "${endpoints[@]}"; do
  for period in "${periods[@]}"; do
    echo "/$endpoint $period" >> "$outfile"
    curl -s -X POST "$base_url/$endpoint" \
      -H "Content-Type: application/json" \
      -d "{\"period\":\"$period\"}" >> "$outfile"
    echo -e "\n....\n" >> "$outfile"
  done
done

echo "All queries complete. Results saved to $outfile"
