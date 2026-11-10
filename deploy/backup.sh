#!/bin/sh
# Daily backup of the blog posts published by the agent (/opt/landscaping/data), kept for
# 14 days in /var/backups/landscaping. deploy.sh installs it with a cron entry at 04:30.
# These copies sit on the same server: also copy them somewhere else now and then.
set -eu

dir=/var/backups/landscaping
mkdir -p "$dir"
chmod 700 "$dir"

tar -czf "$dir/data-$(date +%Y-%m-%d).tgz" -C /opt/landscaping data
find "$dir" -type f -mtime +14 -delete
