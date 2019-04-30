# auth-api-lrv

This project integrates [Login Radius](https://www.loginradius.com) API to get Auth and user profile.
Due to Facebook server should serve on https.To run the server on https, it requires local cretification [More details](https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec)

## Setting you local .env file
```
touch .env
//set TWITTER_KEY, TWITTER_SECRET, GOOGLE_KEY, 
// GOOGLE_SECRET, FACEBOOK_KEY, FACEBOOK_SECRET, ORIGIN,
// SESSION_SECRET, LRV_KEY, LRV_SECRET
npm start
```

## Client 
[Client side](https://github.com/AidenJongheeLee/auth-client)
