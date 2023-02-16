# OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers.ContactApi

All URIs are relative to *api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateContact**](ContactApi.md#createcontact) | **HttpPost** /contacts | Create Contact
[**CreateContactDetail**](ContactApi.md#createcontactdetail) | **HttpPost** /contacts/{id}/details | Create Contact Detail
[**GetContactById**](ContactApi.md#getcontactbyid) | **HttpGet** /contacts/{id} | Get Contact By Id
[**GetContactDetails**](ContactApi.md#getcontactdetails) | **HttpGet** /contacts/{id}/details | Get Contact Details
[**GetContacts**](ContactApi.md#getcontacts) | **HttpGet** /contacts | Get Contacts
[**GetSubscriptionByEmail**](ContactApi.md#getsubscriptionbyemail) | **HttpGet** /contacts/subscriptions/{email} | Get Subscription By Email
[**GetSubscriptions**](ContactApi.md#getsubscriptions) | **HttpGet** /contacts/subscriptions | Get Subscriptions
[**Subscribe**](ContactApi.md#subscribe) | **HttpPost** /contacts/subscriptions/{email} | Subscribe
[**Unsubscribe**](ContactApi.md#unsubscribe) | **HttpDelete** /contacts/subscriptions/{email} | Unsubscribe
[**UpdateContact**](ContactApi.md#updatecontact) | **HttpPut** /contacts/{id} | Update Contact


<a name="createcontact"></a>
# **CreateContact**
> CommandSuccessResponse CreateContact (CreateContactRequest? createContactRequest)

Create Contact

Add a new contact

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.;

namespace Example
{
    public class CreateContactExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var createContactRequest = new CreateContactRequest?(); // CreateContactRequest? |  (optional) 

            try
            {
                // Create Contact
                CommandSuccessResponse result = apiInstance.CreateContact(createContactRequest);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.CreateContact: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createContactRequest** | [**CreateContactRequest?**](CreateContactRequest?.md)|  | [optional] 

### Return type

[**CommandSuccessResponse**](CommandSuccessResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="createcontactdetail"></a>
# **CreateContactDetail**
> CommandSuccessResponse CreateContactDetail (Guid id)

Create Contact Detail

An end point that adds a new detail to an existing contact

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.;

namespace Example
{
    public class CreateContactDetailExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var id = 123e4567-e89b-12d3-a456-426614174000;  // Guid | The records guid

            try
            {
                // Create Contact Detail
                CommandSuccessResponse result = apiInstance.CreateContactDetail(id);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.CreateContactDetail: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Guid**| The records guid | 

### Return type

[**CommandSuccessResponse**](CommandSuccessResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getcontactbyid"></a>
# **GetContactById**
> ContactRecord GetContactById (Guid id)

Get Contact By Id

An end point that returns data for a specific contact

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.;

namespace Example
{
    public class GetContactByIdExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var id = 123e4567-e89b-12d3-a456-426614174000;  // Guid | The records guid

            try
            {
                // Get Contact By Id
                ContactRecord result = apiInstance.GetContactById(id);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.GetContactById: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Guid**| The records guid | 

### Return type

[**ContactRecord**](ContactRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getcontactdetails"></a>
# **GetContactDetails**
> GetContactDetails200Response GetContactDetails (Guid id, int pageNumber, int pageSize, string orderBy, string? reason)

Get Contact Details

An end point that returns detail data for a specific contact

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.;

namespace Example
{
    public class GetContactDetailsExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var id = 123e4567-e89b-12d3-a456-426614174000;  // Guid | The records guid
            var pageNumber = 1;  // int | The current page number of the selected data (default to 1)
            var pageSize = 200;  // int | The maximum amount of data to return in one request (default to 200)
            var orderBy = "\"details\"";  // string | The field to filter data by (default to "details")
            var reason = "business";  // string? | An reason type value to filter the returned contact details  (optional) 

            try
            {
                // Get Contact Details
                GetContactDetails200Response result = apiInstance.GetContactDetails(id, pageNumber, pageSize, orderBy, reason);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.GetContactDetails: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Guid**| The records guid | 
 **pageNumber** | **int**| The current page number of the selected data | [default to 1]
 **pageSize** | **int**| The maximum amount of data to return in one request | [default to 200]
 **orderBy** | **string**| The field to filter data by | [default to &quot;details&quot;]
 **reason** | **string?**| An reason type value to filter the returned contact details  | [optional] 

### Return type

[**GetContactDetails200Response**](GetContactDetails200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getcontacts"></a>
# **GetContacts**
> GetContacts200Response GetContacts (int pageNumber, int pageSize, string orderBy, string? email, string? firstName, string? lastName)

Get Contacts

An end point that returns the list of contacts

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.;

namespace Example
{
    public class GetContactsExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var pageNumber = 1;  // int | The current page number of the selected data (default to 1)
            var pageSize = 200;  // int | The maximum amount of data to return in one request (default to 200)
            var orderBy = "\"email\"";  // string | The field to order the records by (default to "email")
            var email = john@example.com;  // string? | An email value to filter the returned contacts  (optional) 
            var firstName = Ryan;  // string? | A first name value to filter the returned contacts  (optional) 
            var lastName = "lastName_example";  // string? | A last name value to filter the returned contacts  (optional) 

            try
            {
                // Get Contacts
                GetContacts200Response result = apiInstance.GetContacts(pageNumber, pageSize, orderBy, email, firstName, lastName);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.GetContacts: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pageNumber** | **int**| The current page number of the selected data | [default to 1]
 **pageSize** | **int**| The maximum amount of data to return in one request | [default to 200]
 **orderBy** | **string**| The field to order the records by | [default to &quot;email&quot;]
 **email** | **string?**| An email value to filter the returned contacts  | [optional] 
 **firstName** | **string?**| A first name value to filter the returned contacts  | [optional] 
 **lastName** | **string?**| A last name value to filter the returned contacts  | [optional] 

### Return type

[**GetContacts200Response**](GetContacts200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getsubscriptionbyemail"></a>
# **GetSubscriptionByEmail**
> bool GetSubscriptionByEmail (string email)

Get Subscription By Email

An end point that returns a boolean value indicating if the specified email is on the subscription list

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.;

namespace Example
{
    public class GetSubscriptionByEmailExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var email = example@abc.com;  // string | The email of the subscription

            try
            {
                // Get Subscription By Email
                bool result = apiInstance.GetSubscriptionByEmail(email);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.GetSubscriptionByEmail: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **email** | **string**| The email of the subscription | 

### Return type

**bool**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getsubscriptions"></a>
# **GetSubscriptions**
> GetSubscriptions200Response GetSubscriptions (int pageNumber, int pageSize, string orderBy)

Get Subscriptions

An end point that returns a list of emails on the subscription list

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.;

namespace Example
{
    public class GetSubscriptionsExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var pageNumber = 1;  // int | The current page number of the selected data (default to 1)
            var pageSize = 200;  // int | The maximum amount of data to return in one request (default to 200)
            var orderBy = "\"email\"";  // string | The field to order the data by (default to "email")

            try
            {
                // Get Subscriptions
                GetSubscriptions200Response result = apiInstance.GetSubscriptions(pageNumber, pageSize, orderBy);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.GetSubscriptions: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pageNumber** | **int**| The current page number of the selected data | [default to 1]
 **pageSize** | **int**| The maximum amount of data to return in one request | [default to 200]
 **orderBy** | **string**| The field to order the data by | [default to &quot;email&quot;]

### Return type

[**GetSubscriptions200Response**](GetSubscriptions200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="subscribe"></a>
# **Subscribe**
> CommandSuccessResponse Subscribe (string email)

Subscribe

Add a new email address to the subcription list

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.;

namespace Example
{
    public class SubscribeExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var email = example@abc.com;  // string | The email of the subscription

            try
            {
                // Subscribe
                CommandSuccessResponse result = apiInstance.Subscribe(email);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.Subscribe: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **email** | **string**| The email of the subscription | 

### Return type

[**CommandSuccessResponse**](CommandSuccessResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="unsubscribe"></a>
# **Unsubscribe**
> CommandSuccessResponse Unsubscribe (string email)

Unsubscribe

Remove an existing email address from the subcription list

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.;

namespace Example
{
    public class UnsubscribeExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var email = example@abc.com;  // string | The email of the subscription

            try
            {
                // Unsubscribe
                CommandSuccessResponse result = apiInstance.Unsubscribe(email);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.Unsubscribe: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **email** | **string**| The email of the subscription | 

### Return type

[**CommandSuccessResponse**](CommandSuccessResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updatecontact"></a>
# **UpdateContact**
> CommandSuccessResponse UpdateContact (Guid id, ContactHeaderRecord? contactHeaderRecord)

Update Contact

An end point that updates an existing contact

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.;

namespace Example
{
    public class UpdateContactExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var id = 123e4567-e89b-12d3-a456-426614174000;  // Guid | The records guid
            var contactHeaderRecord = new ContactHeaderRecord?(); // ContactHeaderRecord? |  (optional) 

            try
            {
                // Update Contact
                CommandSuccessResponse result = apiInstance.UpdateContact(id, contactHeaderRecord);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.UpdateContact: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Guid**| The records guid | 
 **contactHeaderRecord** | [**ContactHeaderRecord?**](ContactHeaderRecord?.md)|  | [optional] 

### Return type

[**CommandSuccessResponse**](CommandSuccessResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

