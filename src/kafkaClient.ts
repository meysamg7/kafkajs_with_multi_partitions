import { Kafka, logLevel, Producer } from 'kafkajs';
import config from './config/config';

export class KafkaClient {
  static kafka: Kafka;
  static producer: Producer;
  static async init(): Promise<Kafka> {
    KafkaClient.kafka = new Kafka({
      clientId: config.kafka.client,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      brokers: config.kafka.brokers,
      logLevel: logLevel.ERROR,
      retry: {
        retries: 30,
      },
    });

    const admin = KafkaClient.kafka.admin();

    await admin.createTopics({
        topics: [{
          topic: config.kafka.topics.test.topic,
          numPartitions: 4
        }]
    })

    // await admin.createPartitions({
    //   topicPartitions: [{
    //     topic: config.kafka.topics.test.topic,
    //     count: 4     // partition count
    //   }]
    // })

    const MyPartitioner = () => {
      // @ts-ignore
      return ({ topic, partitionMetadata, message }) => {
        return message.key % 4;
      }
    }

    KafkaClient.producer = KafkaClient.kafka.producer({ createPartitioner: MyPartitioner });
    await KafkaClient.producer.connect();

    return KafkaClient.kafka;
  }

  static async sendMessage(topic: string, message: {key: any, value: any}) {
    KafkaClient.producer.send({
      topic,
      messages: [{
        key: `${message.key.toString()}`,
        value: JSON.stringify(message.value)
      }]
    }).catch(console.error)
  }
}