# OpenSystem.Apis.Engagement - ASP.NET Core 7.0 Server

A collection of APIs used to get and set user reactions and comments for an article/page 

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *api/v1.0/api*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ReactionApi* | [**AddReaction**](Documentation/ReactionApi.md#addreaction) | **HttpPost** /articles/{id}/reactions/{type} | Add Reaction
*ReactionApi* | [**DeleteReaction**](Documentation/ReactionApi.md#deletereaction) | **HttpDelete** /articles/{id}/reactions/{type} | Remove Reaction
*ReactionApi* | [**GetReaction**](Documentation/ReactionApi.md#getreaction) | **HttpGet** /articles/{id}/reactions/{type} | Get Reaction
*ReactionApi* | [**GetReactions**](Documentation/ReactionApi.md#getreactions) | **HttpGet** /articles/{id}/reactions | Get Reactions


<a name="documentation-for-models"></a>
## Documentation for Models

 - [OpenSystem.Apis.Engagement.Contracts.GetReaction200ResponseAllOfAllOfDto](Documentation/GetReaction200ResponseAllOfAllOfDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.GetReaction200ResponseAllOfDto](Documentation/GetReaction200ResponseAllOfDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.GetReaction200ResponseDto](Documentation/GetReaction200ResponseDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.GetReactions200ResponseAllOfDto](Documentation/GetReactions200ResponseAllOfDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.GetReactions200ResponseDto](Documentation/GetReactions200ResponseDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.ProblemDetailsDto](Documentation/ProblemDetailsDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.ReactionDetailDto](Documentation/ReactionDetailDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.RecordBaseDto](Documentation/RecordBaseDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.UpdateSuccessResponseDto](Documentation/UpdateSuccessResponseDto.md)


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
docker build -t apis-engagement:latest .
docker run -p 5000:8080 apis-engagement:latest
```
