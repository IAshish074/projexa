const ImageKit = require('imagekit');

if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL) {
  console.error('IMAGEKIT environment variables are missing!');
}

const imagekit = new ImageKit({
  publicKey: (process.env.IMAGEKIT_PUBLIC_KEY || '').trim(),
  privateKey: (process.env.IMAGEKIT_PRIVATE_KEY || '').trim(),
  urlEndpoint: (process.env.IMAGEKIT_URL || '').trim()
});

module.exports = imagekit;
