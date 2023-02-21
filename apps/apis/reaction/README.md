# OpenSystem.Apis.Reaction - ASP.NET Core 7.0 Server

A collection of APIs used to get and set user reactions and comments for an article/page 

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ReactionApi* | [**AddReaction**](Documentation/ReactionApi.md#addreaction) | **HttpPost** /reactions/{contentId} | Add Reaction
*ReactionApi* | [**GetReactions**](Documentation/ReactionApi.md#getreactions) | **HttpGet** /reactions/{contentId} | Get Reactions
*ReactionApi* | [**GetReactionsCount**](Documentation/ReactionApi.md#getreactionscount) | **HttpGet** /reactions/{contentId}/count | Get Reaction Counts
*ReactionApi* | [**RemoveReaction**](Documentation/ReactionApi.md#removereaction) | **HttpDelete** /reactions/{contentId} | Remove Reaction


<a name="documentation-for-models"></a>
## Documentation for Models

No model defined in this package

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
