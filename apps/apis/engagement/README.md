# OpenSystem.Apis.Engagement - ASP.NET Core 7.0 Server

A collection of APIs used to get and set user reactions and comments for an article/page 

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *api/v1.0/api*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ReactionsApi* | [**AddArticleReaction**](Documentation/ReactionsApi.md#addarticlereaction) | **HttpPost** /article/{id}/reaction/{type} | Add Reaction
*ReactionsApi* | [**DeleteArticleReaction**](Documentation/ReactionsApi.md#deletearticlereaction) | **HttpDelete** /article/{id}/reaction/{type} | Remove Reaction
*ReactionsApi* | [**GetArticleReaction**](Documentation/ReactionsApi.md#getarticlereaction) | **HttpGet** /article/{id}/reaction/{type} | Get Reaction
*ReactionsApi* | [**GetArticleReactions**](Documentation/ReactionsApi.md#getarticlereactions) | **HttpGet** /article/{id} | Get Article Reactions


<a name="documentation-for-models"></a>
## Documentation for Models

 - [OpenSystem.Apis.Engagement.Contracts.GetArticleReaction200ResponseAllOfAllOfDto](Documentation/GetArticleReaction200ResponseAllOfAllOfDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.GetArticleReaction200ResponseAllOfDto](Documentation/GetArticleReaction200ResponseAllOfDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.GetArticleReaction200ResponseDto](Documentation/GetArticleReaction200ResponseDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.GetArticleReactions200ResponseAllOfDto](Documentation/GetArticleReactions200ResponseAllOfDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.GetArticleReactions200ResponseDto](Documentation/GetArticleReactions200ResponseDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.ProblemDetailsDto](Documentation/ProblemDetailsDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.ReactionDetailDto](Documentation/ReactionDetailDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.RecordBaseDto](Documentation/RecordBaseDto.md)
 - [OpenSystem.Apis.Engagement.Contracts.UpdateSuccessResponseDto](Documentation/UpdateSuccessResponseDto.md)


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
docker build -t apis-engagement:latest .
docker run -p 5000:8080 apis-engagement:latest
```
