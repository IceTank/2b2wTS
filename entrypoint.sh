ping -q -c 1 -W 1 8.8.8.8 >/dev/null
while [ $? != 0 ]
do
  echo "IPv4 is down"
  sleep 2
  ping -q -c 1 -W 1 8.8.8.8 >/dev/null
done
echo "Has internet connection"

npm run start
