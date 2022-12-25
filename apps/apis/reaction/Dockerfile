#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

# Container we use for final publish
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM node:latest AS node_base

# Build container
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS setup
COPY --from=node_base . .

# Copy the code into the container
WORKDIR /src
COPY . .

ENV NX_DAEMON=false

RUN npm install --legacy-peer-deps
RUN npx nx reset

RUN npm run build:tools
RUN npm run restore

# Build the API
FROM setup AS build
RUN npx nx run apis-reaction:build:docker

# Publish it
FROM build AS publish
RUN npx nx run apis-reaction:publish:docker

# Make the final image for publishing
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OpenSystem.Apis.Reaction.dll"]
