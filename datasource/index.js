var AWS = require('aws-sdk');
var fs = require('fs');

fs.readFile('../params.json', {encoding: 'utf-8'}, function (err, data) {
  if (err) {
    console.log(err);
    return;
  }

  var params = JSON.parse(data);
  var awsCredentials = {
    accessKeyId: params.accessKeyId,
    secretAccessKey: params.secretAccessKey,
    sessionToken: params.sessionToken
  };

  var creds = new AWS.Credentials(awsCredentials);

  var sqsParams = {
    endpoint: params.queueUrl,
    region: params.region,
    credentials: creds
  };
  var sqs = new AWS.SQS(sqsParams);

  for (var i =0; i < 5; i++) {
    var sendParams = {
      MessageBody: 'hello world' + i,
      QueueUrl: params.queueUrl,
      DelaySeconds: 0
    };

    sqs.sendMessage(sendParams, function(err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  }
});