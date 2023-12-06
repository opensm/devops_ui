import { JSEncrypt } from 'jsencrypt'

export function enSecret(data, publickey) {
  const encryptor = new JSEncrypt()
  console.log('加密数据：' + data)
  console.log('加密key：' + publickey)
  encryptor.setPublicKey(publickey)
  const encrypted = encryptor.encrypt(data)
  console.log('加密后：' + encrypted)
  return encrypted
}
