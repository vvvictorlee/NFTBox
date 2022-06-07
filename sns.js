var AWS = require('aws-sdk');
// Set region
AWS.config.update({region: 'ap-northeast-1'});



const sendSM=message=>{
// Create publish parameters
var params = {
  Message: message, /* required */
  TopicArn: 'arn:aws:sns:ap-northeast-1:001552894677:hsc_monitor'
};
console.log(params)
return;   //for test;
// Create promise and SNS service object
var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

// Handle promise's fulfilled/rejected states
publishTextPromise.then(
  function(data) {
    console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
    console.log("MessageID is " + data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
};

module.exports = { sendSM}