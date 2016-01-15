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

  var params = {
    QueueUrl: params.queueUrl,
    WaitTimeSeconds: 10, // long-polling
    MaxNumberOfMessages: 10
  };

  continuouslyRetrieveMessages();



  function continuouslyRetrieveMessages() {
    sqs.receiveMessage(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);

      continuouslyRetrieveMessages();
    });
  }
});
