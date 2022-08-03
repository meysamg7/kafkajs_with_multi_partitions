import 'dotenv/config';
export default  {
    "kafka": {
        "client": "mongerBot-orderBook-fetcher",
        "brokers": (process.env.KAFKA_BROKER) ? process.env.KAFKA_BROKER.split(",") : ["broker:9092"],
        "topics": {
            "test": {
                "topic":"ttc",
                "numPartitions":1
            },
        }
    },

}