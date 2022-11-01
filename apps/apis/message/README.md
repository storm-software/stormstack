# OpenSystem.Apis.Message - ASP.NET Core 6.0 Server

A collection of message APIs used by the Open System repository

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *api/v1.0/messages*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*MessageApi* | [**AddMessage**](Documentation/MessageApi.md#addmessage) | **HttpPost** / | Add Message
*MessageApi* | [**DeleteMessage**](Documentation/MessageApi.md#deletemessage) | **HttpDelete** /{guid} | Remove Message
*MessageApi* | [**GetMessage**](Documentation/MessageApi.md#getmessage) | **HttpGet** /{guid} | Get Message
*MessageApi* | [**GetMessageList**](Documentation/MessageApi.md#getmessagelist) | **HttpGet** / | Get Message List
*MessageApi* | [**UpdateMessage**](Documentation/MessageApi.md#updatemessage) | **HttpPatch** /{guid} | Update Message


<a name="documentation-for-models"></a>
## Documentation for Models

 - [OpenSystem.Apis.Message.Contracts.MessageAllOfDto](Documentation/MessageAllOfDto.md)
 - [OpenSystem.Apis.Message.Contracts.MessageDto](Documentation/MessageDto.md)
 - [OpenSystem.Apis.Message.Contracts.MessageRequestDto](Documentation/MessageRequestDto.md)
 - [OpenSystem.Apis.Message.Contracts.RecordBaseDto](Documentation/RecordBaseDto.md)
 - [OpenSystem.Apis.Message.Contracts.UpdateSuccessResponseDto](Documentation/UpdateSuccessResponseDto.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

<a name="bearer-token"></a>
### bearer-token

- **Type**: Bearer Authentication



## Upgrade NuGet Packages

NuGet packages get frequently updated.

To upgrade this solution to the latest version of all NuGet packages, use the dotnet-outdated tool.


Install dotnet-outdated tool:

```
dotnet tool install --global dotnet-outdated-tool
```

Upgrade only to new minor versions of packages

```
dotnet outdated --upgrade --version-lock Major
```

Upgrade to all new versions of packages (more likely to include breaking API changes)

```
dotnet outdated --upgrade
```


## Run

Linux/OS X:

```
sh build.sh
```

Windows:

```
build.bat
```
## Run in Docker

```
docker build -t messageservice.api:latest .
docker run -p 5000:8080 messageservice.api:latest
```
