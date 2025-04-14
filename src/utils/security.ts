import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || '';

export const encrypt = (text: string): string => {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(ENCRYPTION_IV, 'hex')
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decrypt = (encryptedText: string): string => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(ENCRYPTION_IV, 'hex')
  );
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export const generateApiKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashApiKey = (apiKey: string): string => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};

export const verifyApiKey = (apiKey: string, hashedApiKey: string): boolean => {
  return hashApiKey(apiKey) === hashedApiKey;
}; 