#!/usr/bin/env bash
# Builds the image on this machine, ships it to the bueno server and restarts the site.
# The server has 2 GB of RAM shared with buenoexoticsny.com, so nothing is built there.
#
#   bash deploy/deploy.sh
#
# Needs Docker locally and the `bueno` host in ~/.ssh/config.
set -euo pipefail

host=bueno
remote_dir=/opt/landscaping
image=bueno-landscaping:latest
site_url=https://buenolandscapinginc.com
# GA4 measurement ID (public). Override with NEXT_PUBLIC_GA_ID=... or set it empty to turn analytics off.
ga_id=${NEXT_PUBLIC_GA_ID-G-04X0RKS8YM}

cd "$(dirname "$0")/.."

echo "Building $image..."
docker build --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_SITE_URL="$site_url" \
  --build-arg NEXT_PUBLIC_GA_ID="$ga_id" \
  -t "$image" .

echo "Uploading..."
ssh "$host" "mkdir -p $remote_dir/data/blog && chown 1000:1000 $remote_dir/data/blog && touch $remote_dir/.env && chmod 600 $remote_dir/.env"
scp -q deploy/docker-compose.yml "$host:$remote_dir/docker-compose.yml"
scp -q deploy/backup.sh "$host:$remote_dir/backup.sh"
ssh "$host" "chmod 700 $remote_dir/backup.sh && echo '30 4 * * * root $remote_dir/backup.sh >> /var/log/landscaping-backup.log 2>&1' > /etc/cron.d/landscaping-backup"
docker save "$image" | gzip | ssh "$host" "gunzip | docker load"

echo "Restarting..."
ssh "$host" "cd $remote_dir && docker compose up -d && docker image prune -f >/dev/null"

echo -n "Waiting for $site_url ..."
for _ in $(seq 1 30); do
  if curl -fsS -o /dev/null "$site_url/"; then
    echo " up."
    exit 0
  fi
  echo -n "."
  sleep 2
done
echo
echo "No answer after 60 seconds. Logs: ssh $host 'cd $remote_dir && docker compose logs --tail=50'"
exit 1
