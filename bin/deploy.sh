cd /home/peach/peach_ledger_app/peach-ledger &&
git reset --hard &&
git pull &&
docker-compose down &&
docker-compose up -d &&
echo 'OK!'
