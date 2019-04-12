npm run build
aws s3 sync dist/ s3://ridership.axismaps.io --delete
aws cloudfront create-invalidation --distribution-id E3OICTR2L3KDJ4 --paths "/*"