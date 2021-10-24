while ! $(ping -q -c 1 -W 1 8.8.8.8 >/dev/null)
do
  echo "IPv4 is down"
  sleep 2
done
echo "Has internet connection"

npm run start
