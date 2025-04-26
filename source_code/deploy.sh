echo "Deployment in progress..."
git pull
cd client
npm i
npm run build
rm -rf ../server/dist/
cp -r dist ../server/
cd ../server
npm i
docker build -t manikumar/seassignment .
docker-compose up
echo "Deployment successful."



