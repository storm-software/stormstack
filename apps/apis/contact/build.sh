#!/usr/bin/env bash
#
# Generated by: https://openapi-generator.tech
#

dotnet restore ./ && \
    dotnet build ./ && \
    echo "Now, run the following to start the project: dotnet run -p OpenSystem.Apis.Contact.csproj --launch-profile web"
