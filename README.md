打包app
cd android
./gradlew assembleRelease

生成签名密钥
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 1000
