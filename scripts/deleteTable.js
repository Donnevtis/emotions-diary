const dynamodb = require('./createTable')
const { DeleteTableCommand } = require('@aws-sdk/client-dynamodb')

dynamodb
  .send(
    new DeleteTableCommand({
      TableName: 'Users',
    }),
  )
  .then(data => {
    console.log('Table deleted. JSON: ', JSON.stringify(data, null, 2))
  })
  .catch(err => {
    console.log("Table wasn't deleted. Error: ", err)
  })
