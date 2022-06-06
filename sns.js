var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials();
AWS.config.credentials = credentials;
// Set region
AWS.config.update({region: 'REGION'});

// Create publish parameters
var params = {
  Message: 'TEXT_MESSAGE', /* required */
  PhoneNumber: 'E.164_PHONE_NUMBER',
};

// Create promise and SNS service object
var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

// Handle promise's fulfilled/rejected states
publishTextPromise.then(
  function(data) {
    console.log("MessageID is " + data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
