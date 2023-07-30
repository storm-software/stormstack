<h1 align="center">TypeScript Kafka template</h1>

<p align="center">
  <em>This is a TypeScript Kafka template for the AsyncAPI generator</em>
</p>


<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](##Contributors-✨)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This template is for generating a TypeScript wrapper for the Kafka client based on your AsyncAPI document. The template uses the [Kafka.Js](https://kafka.js.org/) library.

Have you found a bug or have an idea for improvement? Feel free to contribute! See [the contribution guidelines](#Contributing) how to do so.

## Example usage
Given any AsyncAPI file (`AsyncAPI.yml`) first generate the client with the [AsyncAPI generator](https://github.com/asyncapi/generator) such as 
```bash
ag .\asyncapi.yaml .\typescript-kafka-template\ -o .\output --force-write -p server=production
```

# How to use
The generated output shall be seen a subscriber and/or publisher of message on/from a rabbit mq broker.

## Requirements
* @asyncapi/generator < v2.0.0 >v1.1.1

Install the generator through [npm or run it from docker official installer](https://github.com/asyncapi/generator#install).

