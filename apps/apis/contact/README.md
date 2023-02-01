# OpenSystem.Apis.Contact - ASP.NET Core 7.0 Server

A collection of APIs used to get and set contact related data 

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ContactApi* | [**AddContactRequest**](Documentation/ContactApi.md#addcontactrequest) | **HttpPost** /requests/{id} | Add Contact Request
*ContactApi* | [**GetContactRequest**](Documentation/ContactApi.md#getcontactrequest) | **HttpGet** /requests/{id} | Get Contact Request
*ContactApi* | [**GetContactRequests**](Documentation/ContactApi.md#getcontactrequests) | **HttpGet** /requests | Get Contact Requests
*ContactApi* | [**GetSubscription**](Documentation/ContactApi.md#getsubscription) | **HttpGet** /subscriptions/{email} | Get Subscription
*ContactApi* | [**GetSubscriptions**](Documentation/ContactApi.md#getsubscriptions) | **HttpGet** /subscriptions | Get Subscriptions
*ContactApi* | [**Subscribe**](Documentation/ContactApi.md#subscribe) | **HttpPost** /subscriptions/{email} | Subscribe
*ContactApi* | [**Unsubscribe**](Documentation/ContactApi.md#unsubscribe) | **HttpDelete** /subscriptions/{email} | Unsubscribe


<a name="documentation-for-models"></a>
## Documentation for Models

 - [OpenSystem.Apis.Contact.Contracts.ContactDetailDto](Documentation/ContactDetailDto.md)
 - [OpenSystem.Apis.Contact.Contracts.ContactDto](Documentation/ContactDto.md)
 - [OpenSystem.Apis.Contact.Contracts.ProblemDetailsDto](Documentation/ProblemDetailsDto.md)
 - [OpenSystem.Apis.Contact.Contracts.RecordBaseDto](Documentation/RecordBaseDto.md)
 - [OpenSystem.Apis.Contact.Contracts.UpdateSuccessResponseDto](Documentation/UpdateSuccessResponseDto.md)


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
docker build -t apis-contact:latest .
docker run -p 5000:8080 apis-contact:latest
```
