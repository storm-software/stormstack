# OpenSystem.Reaction.Application - ASP.NET Core 7.0 Server

A collection of APIs used to get and set user reactions and comments for an article/page 

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ReactionRequests* | [**AddReaction**](Documentation/ReactionRequests.md#addreaction) | **HttpPost** /reactions/{contentId} | Add Reaction
*ReactionRequests* | [**GetReactions**](Documentation/ReactionRequests.md#getreactions) | **HttpGet** /reactions/{contentId} | Get Reactions
*ReactionRequests* | [**GetReactionsCount**](Documentation/ReactionRequests.md#getreactionscount) | **HttpGet** /reactions/{contentId}/count | Get Reaction Counts
*ReactionRequests* | [**RemoveReaction**](Documentation/ReactionRequests.md#removereaction) | **HttpDelete** /reactions/{contentId} | Remove Reaction


<a name="documentation-for-models"></a>
## Documentation for Models

 - [OpenSystem.Reaction.Application.Models.DTOs.AddReactionRequest](Documentation/AddReactionRequest.md)
 - [OpenSystem.Reaction.Application.Models.DTOs.CommandSuccessResponse](Documentation/CommandSuccessResponse.md)
 - [OpenSystem.Reaction.Application.Models.DTOs.GetReactions200Response](Documentation/GetReactions200Response.md)
 - [OpenSystem.Reaction.Application.Models.DTOs.GetReactions200ResponseAllOf](Documentation/GetReactions200ResponseAllOf.md)
 - [OpenSystem.Reaction.Application.Models.DTOs.GetReactionsCount200Response](Documentation/GetReactionsCount200Response.md)
 - [OpenSystem.Reaction.Application.Models.DTOs.PagedQueryResponse](Documentation/PagedQueryResponse.md)
 - [OpenSystem.Reaction.Application.Models.DTOs.ProblemDetailsResponse](Documentation/ProblemDetailsResponse.md)
 - [OpenSystem.Reaction.Application.Models.DTOs.ReactionCountRecord](Documentation/ReactionCountRecord.md)
 - [OpenSystem.Reaction.Application.Models.DTOs.ReactionDetailRecord](Documentation/ReactionDetailRecord.md)
 - [OpenSystem.Reaction.Application.Models.DTOs.ReactionDetailRecordAllOf](Documentation/ReactionDetailRecordAllOf.md)
 - [OpenSystem.Reaction.Application.Models.DTOs.RecordBase](Documentation/RecordBase.md)


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
docker build -t reaction-server-application:latest .
docker run -p 5000:8080 reaction-server-application:latest
```
