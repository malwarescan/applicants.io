#!/bin/bash
# Scheduled script to update Synaxus jobs
# Can be run via cron: 0 */6 * * * /path/to/scripts/update-synaxus-jobs.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/../logs/synaxus-jobs-update.log"

# Create logs directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting Synaxus jobs update..."

# Change to project directory
cd "$SCRIPT_DIR/.." || exit 1

# Run the scraper
php scripts/scrape-synaxus-jobs.php --save >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
    log "Synaxus jobs updated successfully"
    
    # Optionally, trigger a rebuild of the site if needed
    # npm run build
    
    exit 0
else
    log "ERROR: Failed to update Synaxus jobs"
    exit 1
fi
