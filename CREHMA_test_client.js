const http = require('http')
const CREHMA = require("./CREHMA.js");
const CREHMAResponse = require("./CREHMAResponse.js");
const CREHMARequest = require("./CREHMARequest.js")
const base64Key = "fJW7ebII2E4RU3fD4BjixIDnV++0mq8LUY5TMx2C/g5nRDDies4AFLZ939sU1uoMH+uey1xUMKVSFCd+VNXg+4yOS1M/DtM+9ObW108iNmlXZQsKgXLkRLrBkZ78y2r8Mml3WXe14ktXjCjhRXTx5lBsTKMEcBTxepe1aQ+0hLNOUDhsUKr31t9fS5/9nAQC7s9sPln54Oic1pnDOIfnBEku/vPl3zQCMtU2eRk9v+AfschSUGOvLV6Ctg0cGuSi/h8oKZuUYXrjoehUo1gBvZLVBpcCxZt1/ySGTInLic3QbfZwlT5sJKrYvfHXjANOEIM7JZMaSnfMdK2R9OJJpw=="
const key = Buffer.from(base64Key,'base64');
const kid = "jCREHMAKey";

var SHA256 = require("./SHA256.js");
var HMACSHA256 = require("./HMACSHA256.js");

const crehma = new CREHMA()

var signatureAlgorithm = new HMACSHA256();
signatureAlgorithm.setKey(kid,key);

var hashAlgorithm = new SHA256();

crehma.addSignatureAlgorithm(signatureAlgorithm.getName(),signatureAlgorithm);
crehma.addHashAlgorithm(hashAlgorithm.getName(),hashAlgorithm)


var request = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Host': "localhost:3000"
  }
}

var addHeaders = "null";

var crehmaReq = new CREHMARequest(request.method, request.path)

for (var header in request.headers) {
  crehmaReq.setHeader(header,request.headers[header])
}

request.headers["Signature"] = crehma.generateSignatureHeaderRequest(crehmaReq,kid,addHeaders,signatureAlgorithm.getName(),hashAlgorithm.getName())
console.log(request.headers["Signature"]);
var crehmaRes;
const req = http.request(request, (res) => {

crehmaRes = new CREHMAResponse(res.statusCode);

for (var header in res.headers){
  crehmaRes.setHeader(header,res.headers[header])
}

res.on('data', (d) => {
    process.stdout.write(d)
    crehmaRes.setBody(d);
    console.log(crehma.verifyResponse(crehmaRes,crehmaReq));
    console.log(crehmaRes.getHeader("Signature"));
  })
})

req.on('error', (error) => {
  //console.error(error)
})



req.end()