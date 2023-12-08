import { JSEncrypt } from 'jsencrypt'

export function enSecret(data, publickey) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publickey)
  const encrypted = encryptor.encrypt(data.toString())
  console.log('加密后：' + encrypted)
  return encrypted
}
