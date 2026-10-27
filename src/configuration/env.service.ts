
import dotenv from 'dotenv';

dotenv.config({
  path: [
    process.env.NODE_ENV === 'production'
      ? '.env.prod'
      : '.env.dev',
  ],
});

export const env = {
  get port() {
    return Number(process.env.PORT) || 3000;
  },

  get databaseURL() {
    return process.env.MONGO_URL as string;
  },

  get mood() {
    return process.env.MOOD_ENV as string;
  },

  get salt() {
    return Number(process.env.SALT);
  },

  get jwtAdminSecret() {
    return process.env.JWT_KEY_Admin as string;
  },

  get jwtUserSecret() {
    return process.env.JWT_KEY_User as string;
  },

  get adminRefreshToken() {
    return process.env.ADMIN_REFRESH_TOKEN as string;
  },

  get userRefreshToken() {
    return process.env.USER_REFRESH_TOKEN as string;
  },

  get googleAppPassword() {
    return process.env.GOOGLE_APP_PASSWORD as string;
  },

  get googleAccountEmail() {
    return process.env.GOOGLE_ACCOUNT_EMAIL as string;
  },

  get serverURL() {
    return process.env.SERVER_URL as string;
  },

  get encryptionKey() {
    return process.env.ENCRYPTION_KEY as string;
  },

  get googleClientId() {
    return process.env.GOOGLE_CLIENT_ID as string;
  },

  get accessKeyId() {
    return process.env.ACCESS_KEY_ID as string;
  },

  get secretAccessKey() {
    return process.env.SECRET_ACCESS_KEY as string;
  },

  get awsBucketName() {
    return process.env.AWS_BUCKET_NAME as string;
  },

  get redisURL() {
    return process.env.REDIS_URL as string;
  },
 
};
