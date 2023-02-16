# OpenSystem.Contact.Application - ASP.NET Core 7.0 Server

A collection of APIs used to get and set contact related data 

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ContactRequests* | [**CreateContact**](Documentation/ContactRequests.md#createcontact) | **HttpPost** /contacts | Create Contact
*ContactRequests* | [**CreateContactDetail**](Documentation/ContactRequests.md#createcontactdetail) | **HttpPost** /contacts/{id}/details | Create Contact Detail
*ContactRequests* | [**GetContactById**](Documentation/ContactRequests.md#getcontactbyid) | **HttpGet** /contacts/{id} | Get Contact By Id
*ContactRequests* | [**GetContactDetails**](Documentation/ContactRequests.md#getcontactdetails) | **HttpGet** /contacts/{id}/details | Get Contact Details
*ContactRequests* | [**GetContacts**](Documentation/ContactRequests.md#getcontacts) | **HttpGet** /contacts | Get Contacts
*ContactRequests* | [**GetSubscriptionByEmail**](Documentation/ContactRequests.md#getsubscriptionbyemail) | **HttpGet** /contacts/subscriptions/{email} | Get Subscription By Email
*ContactRequests* | [**GetSubscriptions**](Documentation/ContactRequests.md#getsubscriptions) | **HttpGet** /contacts/subscriptions | Get Subscriptions
*ContactRequests* | [**Subscribe**](Documentation/ContactRequests.md#subscribe) | **HttpPost** /contacts/subscriptions/{email} | Subscribe
*ContactRequests* | [**Unsubscribe**](Documentation/ContactRequests.md#unsubscribe) | **HttpDelete** /contacts/subscriptions/{email} | Unsubscribe
*ContactRequests* | [**UpdateContact**](Documentation/ContactRequests.md#updatecontact) | **HttpPut** /contacts/{id} | Update Contact


<a name="documentation-for-models"></a>
## Documentation for Models

 - [OpenSystem.Contact.Application.Models.DTOs.Address](Documentation/Address.md)
 - [OpenSystem.Contact.Application.Models.DTOs.CommandSuccessResponse](Documentation/CommandSuccessResponse.md)
 - [OpenSystem.Contact.Application.Models.DTOs.ContactDetailRecord](Documentation/ContactDetailRecord.md)
 - [OpenSystem.Contact.Application.Models.DTOs.ContactHeaderRecord](Documentation/ContactHeaderRecord.md)
 - [OpenSystem.Contact.Application.Models.DTOs.ContactHeaderRecordAllOf](Documentation/ContactHeaderRecordAllOf.md)
 - [OpenSystem.Contact.Application.Models.DTOs.ContactRecord](Documentation/ContactRecord.md)
 - [OpenSystem.Contact.Application.Models.DTOs.CreateContactRequest](Documentation/CreateContactRequest.md)
 - [OpenSystem.Contact.Application.Models.DTOs.GetContactDetails200Response](Documentation/GetContactDetails200Response.md)
 - [OpenSystem.Contact.Application.Models.DTOs.GetContactDetails200ResponseAllOf](Documentation/GetContactDetails200ResponseAllOf.md)
 - [OpenSystem.Contact.Application.Models.DTOs.GetContacts200Response](Documentation/GetContacts200Response.md)
 - [OpenSystem.Contact.Application.Models.DTOs.GetContacts200ResponseAllOf](Documentation/GetContacts200ResponseAllOf.md)
 - [OpenSystem.Contact.Application.Models.DTOs.GetSubscriptions200Response](Documentation/GetSubscriptions200Response.md)
 - [OpenSystem.Contact.Application.Models.DTOs.GetSubscriptions200ResponseAllOf](Documentation/GetSubscriptions200ResponseAllOf.md)
 - [OpenSystem.Contact.Application.Models.DTOs.PagedQueryResponse](Documentation/PagedQueryResponse.md)
 - [OpenSystem.Contact.Application.Models.DTOs.ProblemDetailsResponse](Documentation/ProblemDetailsResponse.md)
 - [OpenSystem.Contact.Application.Models.DTOs.RecordBase](Documentation/RecordBase.md)


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
docker build -t contact-server-application:latest .
docker run -p 5000:8080 contact-server-application:latest
```
