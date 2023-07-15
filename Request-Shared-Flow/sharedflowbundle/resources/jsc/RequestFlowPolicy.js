/*
    Salt Security Apigee mirroring Integration v2.0.6.
    Copyright (C) 2022 Salt Security Inc.
*/

var version = "2.0.6";

var requestPayload = {
    'timestamp' : new Date(context.getVariable("system.timestamp")).toISOString(),
    'requestId' : context.getVariable('messageid'),
    'method' : context.getVariable('request.verb'),
    'originalClientIp' : context.getVariable('client.ip'),
    'uri' : context.getVariable('request.uri'),
    'httpVersion' : 'HTTP/'+context.getVariable('request.version'),
    'headers' : context
                .getVariable('request.headers.names')
                .toArray()
                .map(headerName => headerName + ':' + context.getVariable('request.header.' + headerName+'.values').toArray().join(";")),
    'body' : crypto.base64(crypto.asBytes(context.getVariable('request.content')))
};

context.setVariable('salt.request.payload', requestPayload);
