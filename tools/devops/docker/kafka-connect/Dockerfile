FROM confluentinc/cp-kafka-connect-base:7.5.2

RUN    confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:latest \
    && confluent-hub install --no-prompt debezium/debezium-connector-postgresql:latest