# OpenSystem.Apis.Reaction - ASP.NET Core 7.0 Server

A collection of APIs used to get and set user reactions and comments for an article/page 

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ReactionsApi* | [**AddReaction**](Documentation/ReactionsApi.md#addreaction) | **HttpPost** /reactions/{contentType}/{contentId}/reaction/{reactionType} | Add Reaction
*ReactionsApi* | [**DeleteReaction**](Documentation/ReactionsApi.md#deletereaction) | **HttpDelete** /reactions/{contentType}/{contentId}/reaction/{reactionType} | Remove Reaction
*ReactionsApi* | [**GetReaction**](Documentation/ReactionsApi.md#getreaction) | **HttpGet** /reactions/{contentType}/{contentId}/reaction/{reactionType} | Get Reaction
*ReactionsApi* | [**GetReactions**](Documentation/ReactionsApi.md#getreactions) | **HttpGet** /reactions/{contentType}/{contentId} | Get Reactions


<a name="documentation-for-models"></a>
## Documentation for Models

 - [OpenSystem.Apis.Reaction.Contracts.GetReaction200ResponseAllOfAllOfDto](Documentation/GetReaction200ResponseAllOfAllOfDto.md)
 - [OpenSystem.Apis.Reaction.Contracts.GetReaction200ResponseAllOfDto](Documentation/GetReaction200ResponseAllOfDto.md)
 - [OpenSystem.Apis.Reaction.Contracts.GetReaction200ResponseDto](Documentation/GetReaction200ResponseDto.md)
 - [OpenSystem.Apis.Reaction.Contracts.GetReactions200ResponseAllOfDto](Documentation/GetReactions200ResponseAllOfDto.md)
 - [OpenSystem.Apis.Reaction.Contracts.GetReactions200ResponseDto](Documentation/GetReactions200ResponseDto.md)
 - [OpenSystem.Apis.Reaction.Contracts.ProblemDetailsDto](Documentation/ProblemDetailsDto.md)
 - [OpenSystem.Apis.Reaction.Contracts.ReactionDetailDto](Documentation/ReactionDetailDto.md)
 - [OpenSystem.Apis.Reaction.Contracts.RecordBaseDto](Documentation/RecordBaseDto.md)
 - [OpenSystem.Apis.Reaction.Contracts.UpdateSuccessResponseDto](Documentation/UpdateSuccessResponseDto.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

All endpoints do not require authorization.


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
docker build -t apis-reaction:latest .
docker run -p 5000:8080 apis-reaction:latest
```
