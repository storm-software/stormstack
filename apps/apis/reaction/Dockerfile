#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

# Container we use for final publish
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM node:latest AS node_base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat

# Build container
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS setup
COPY --from=node_base . .

WORKDIR /src

# Install app dependencies
ENV NX_DAEMON=false
ENV CI=true

COPY package.json /src
COPY package-lock.json /src
RUN npm install --legacy-peer-deps

# Copy the code into the container
COPY . .

FROM setup AS prepare

RUN npx nx reset
RUN npx nx run tools-executors-dotnet:build:build

# Build the API
FROM prepare AS build
RUN npx nx run apis-reaction:build-base:docker

# Publish it
FROM build AS publish
RUN npx nx run apis-reaction:publish:docker

# Make the final image for publishing
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OpenSystem.Apis.Reaction.dll"]
