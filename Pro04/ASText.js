var RSAKey= require('react-native-rsa');
const bits = 1024;
const exponent = '10001'; // must be a string
var rsa = new RSAKey();
var r = rsa.generate(bits, exponent);
var publicKey = rsa.getPublicString();
function _encrypt(Key){
    var promise = new Promise(function(resolve, reject) {
        var rsa = new RSAKey();
        rsa.setPublicString(Key);
        var Cipher = rsa.encrypt("123456");
        resolve(Cipher);
    });
    return promise;
}
_encrypt(publicKey).then((cipher)=>{
    console.log(cipher)
}).catch((err)=>{
    console.log(err);
});

