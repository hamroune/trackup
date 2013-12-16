rm -rf ./build &&
rsync -aqz * ./build &&

cd ./build

echo "node_modules/*" > .gitignore ;

git init;

git remote add $1 git@heroku.com:$1.git ;

git remote -v ;

git add .;

git commit -m "deploy" ;

git push -f $1 master:master;
