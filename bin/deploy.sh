npm run build
aws s3 sync dist/ s3://ridership.axismaps.io --delete