# OpenSystem.Apis.Contact - ASP.NET Core 7.0 Server

A collection of APIs used to get and set contact related data 

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ContactApi* | [**CreateContact**](Documentation/ContactApi.md#createcontact) | **HttpPost** /contacts | Create Contact
*ContactApi* | [**CreateContactDetail**](Documentation/ContactApi.md#createcontactdetail) | **HttpPost** /contacts/{id}/details | Create Contact Detail
*ContactApi* | [**GetContactById**](Documentation/ContactApi.md#getcontactbyid) | **HttpGet** /contacts/{id} | Get Contact By Id
*ContactApi* | [**GetContactDetails**](Documentation/ContactApi.md#getcontactdetails) | **HttpGet** /contacts/{id}/details | Get Contact Details
*ContactApi* | [**GetContacts**](Documentation/ContactApi.md#getcontacts) | **HttpGet** /contacts | Get Contacts
*ContactApi* | [**GetSubscriptionByEmail**](Documentation/ContactApi.md#getsubscriptionbyemail) | **HttpGet** /contacts/subscriptions/{email} | Get Subscription By Email
*ContactApi* | [**GetSubscriptions**](Documentation/ContactApi.md#getsubscriptions) | **HttpGet** /contacts/subscriptions | Get Subscriptions
*ContactApi* | [**Subscribe**](Documentation/ContactApi.md#subscribe) | **HttpPost** /contacts/subscriptions/{email} | Subscribe
*ContactApi* | [**Unsubscribe**](Documentation/ContactApi.md#unsubscribe) | **HttpDelete** /contacts/subscriptions/{email} | Unsubscribe
*ContactApi* | [**UpdateContact**](Documentation/ContactApi.md#updatecontact) | **HttpPut** /contacts/{id} | Update Contact


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
docker build -t apis-contact:latest .
docker run -p 5000:8080 apis-contact:latest
```
