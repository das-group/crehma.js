const CREHMA = require("./CREHMA.js");
const CREHMAResponse = require("./CREHMAResponse.js");
const CREHMARequest = require("./CREHMARequest.js")

var SHA256 = require("./SHA256.js");
var HMACSHA256 = require("./HMACSHA256.js");

const crehma = new CREHMA()

var signatureAlgorithm = new HMACSHA256();
signatureAlgorithm.setKey(kid,key);

var hashAlgorithm = new SHA256();

crehma.addSignatureAlgorithm(signatureAlgorithm.getName(),signatureAlgorithm);
crehma.addHashAlgorithm(hashAlgorithm.getName(),hashAlgorithm)

function signRequest(request){
	var crehmaReq = new CREHMARequest(request.method, request.path)

	for (var header in request.headers) {
	  crehmaReq.setHeader(header,request.headers[header])
	}

	crehmaReq.setBody(request.body)

	request.headers["Signature"] = crehma.generateSignatureHeaderRequest(crehmaReq,kid,addHeaders,signatureAlgorithm.getName(),hashAlgorithm.getName())
}

function verifyRequest(request){
	crehmaRes = new CREHMAResponse(res.statusCode);

	for (var header in res.headers){
	  crehmaRes.setHeader(header,res.headers[header])
	}
}

function signResponse(response){

}

function verifyResponse(response){

}