const amqp = require('amqplib')

module.exports = async () => {
  //noime rota padrao 
  const queueName = `tester`
  //nome rota backup
  const letterRoutingKey = `dlqName`
  const conn = await amqp.connect(process.env.urlQueue)
  const channel = await conn.createChannel()
  await channel.assertQueue(
    queueName, 
    {
      deadLetterExchange: '',  
      deadLetterRoutingKey: letterRoutingKey,
    }
  )
  await channel.assertQueue(letterRoutingKey)
  await channel.prefetch(50)
  const consumer = await channel.consume(queueName, async (fetched) => {
    const {name, age} = JSON.parse(fetched.content.toString())
    if( age > 30 || age < 25 ) {
      await channel.nack(fetched, false, false)
      console.log('Unprocessed', {name, age}) 
    } else {
      await channel.ack(fetched)
      console.log('Message ', {name, age}) 
    }
  })
}