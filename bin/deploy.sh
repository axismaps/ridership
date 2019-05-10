npm run build
if [ "$1" == live ]; then
  aws s3 sync dist/ s3://ridership.axismaps.io --delete
  aws cloudfront create-invalidation --distribution-id E3OICTR2L3KDJ4 --paths "/*"
else
  aws s3 sync dist/ s3://ridership-dev.axismaps.io --delete
fi