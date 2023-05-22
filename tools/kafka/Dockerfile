FROM confluentinc/cp-kafka-connect-base:6.0.0

RUN confluent-hub install --no-prompt ably/kafka-connect-ably:latest

COPY --from=build /usr/src/app/target/kafka-connect-target/usr/share/kafka-connect /plugins/

ADD tools/kafka/docker-entrypoint.sh /bin/docker-entrypoint.sh
ENTRYPOINT ["/bin/docker-entrypoint.sh"]
