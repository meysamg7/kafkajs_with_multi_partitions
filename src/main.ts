import config from './config/config';
import { KafkaClient } from './kafkaClient';
const { PartitionAssigners: { roundRobin } } = require('kafkajs')

const bootstrap = async () => {
    await KafkaClient.init();
    KafkaClient.sendMessage(config.kafka.topics.test.topic,{
        key: 5,
        value: {
            name: 'a'
        }
    });
    KafkaClient.sendMessage(config.kafka.topics.test.topic,{
        key: 10,
        value: {
            name: 'c'
        }
    });
    KafkaClient.sendMessage(config.kafka.topics.test.topic,{
        key: 3,
        value: {
            name: 'b'
        }
    });
    KafkaClient.sendMessage(config.kafka.topics.test.topic,{
        key: 4,
        value: {
            name: 'd'
        }
    });

    const consumer = KafkaClient.kafka.consumer({
        groupId: 'consumer-listener',
        // partitionAssigners: [
        //     roundRobin
        // ]
    });

    await consumer.subscribe({
        topic: config.kafka.topics.test.topic
    });

    await consumer.run({
        // autoCommit: false,
        partitionsConsumedConcurrently: 4, // Default: 1
        eachMessage: async ({topic,partition, message}) => {
            console.log(`=========== new message ==========`);
            if(message.key && message.value){
                const key = message.key.toString();
                console.log(partition)
                console.log(key)
            }
            
        }
    });



    
    console.log(`OrderBook watcher successfully started.`);
}
bootstrap().catch(console.error);   