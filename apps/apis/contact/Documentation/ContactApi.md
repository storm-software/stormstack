# OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers.ContactApi

All URIs are relative to *api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateContact**](ContactApi.md#createcontact) | **HttpPost** /contacts | Create Contact
[**CreateContactDetail**](ContactApi.md#createcontactdetail) | **HttpPost** /contacts/{id}/details | Create Contact Detail
[**GetContact**](ContactApi.md#getcontact) | **HttpGet** /contacts/{id} | Get Contact
[**GetContactDetails**](ContactApi.md#getcontactdetails) | **HttpGet** /contacts/{id}/details | Get Contact Details
[**GetContacts**](ContactApi.md#getcontacts) | **HttpGet** /contacts | Get Contacts
[**GetSubscription**](ContactApi.md#getsubscription) | **HttpGet** /contacts/subscriptions/{email} | Get Subscription
[**GetSubscriptions**](ContactApi.md#getsubscriptions) | **HttpGet** /contacts/subscriptions | Get Subscriptions
[**Subscribe**](ContactApi.md#subscribe) | **HttpPost** /contacts/subscriptions/{email} | Subscribe
[**Unsubscribe**](ContactApi.md#unsubscribe) | **HttpDelete** /contacts/subscriptions/{email} | Unsubscribe
[**UpdateContact**](ContactApi.md#updatecontact) | **HttpPut** /contacts/{id} | Update Contact


<a name="createcontact"></a>
# **CreateContact**
> CommandSuccessResponse CreateContact (string userId, CreateContactRequest? createContactRequest)

Create Contact

Add a new contact

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Contracts;

namespace Example
{
    public class CreateContactExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var userId = "userId_example";  // string | The id of the current user sending the request
            var createContactRequest = new CreateContactRequest?(); // CreateContactRequest? |  (optional) 

            try
            {
                // Create Contact
                CommandSuccessResponse result = apiInstance.CreateContact(userId, createContactRequest);
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
 **userId** | **string**| The id of the current user sending the request | 
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
> CommandSuccessResponse CreateContactDetail (Guid id, string userId)

Create Contact Detail

An end point that adds a new detail to an existing contact

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Contracts;

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
            var userId = PSUL;  // string | User Id sending request

            try
            {
                // Create Contact Detail
                CommandSuccessResponse result = apiInstance.CreateContactDetail(id, userId);
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
 **userId** | **string**| User Id sending request | 

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

<a name="getcontact"></a>
# **GetContact**
> Contact GetContact (Guid id, string userId)

Get Contact

An end point that returns data for a specific contact

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Contracts;

namespace Example
{
    public class GetContactExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var id = 123e4567-e89b-12d3-a456-426614174000;  // Guid | The records guid
            var userId = "userId_example";  // string | The id of the current user sending the request

            try
            {
                // Get Contact
                Contact result = apiInstance.GetContact(id, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.GetContact: " + e.Message );
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
 **userId** | **string**| The id of the current user sending the request | 

### Return type

[**Contact**](Contact.md)

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
> List&lt;ContactDetail&gt; GetContactDetails (Guid id, string userId, string? reason)

Get Contact Details

An end point that returns detail data for a specific contact

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Contracts;

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
            var userId = "userId_example";  // string | The id of the current user sending the request
            var reason = "business";  // string? | An reason type value to filter the returned contact details  (optional) 

            try
            {
                // Get Contact Details
                List<ContactDetail> result = apiInstance.GetContactDetails(id, userId, reason);
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
 **userId** | **string**| The id of the current user sending the request | 
 **reason** | **string?**| An reason type value to filter the returned contact details  | [optional] 

### Return type

[**List&lt;ContactDetail&gt;**](ContactDetail.md)

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
> List&lt;Contact&gt; GetContacts (string userId, string? email, string? firstName, string? lastName)

Get Contacts

An end point that returns the list of contacts

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Contracts;

namespace Example
{
    public class GetContactsExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var userId = "userId_example";  // string | The id of the current user sending the request
            var email = john@example.com;  // string? | An email value to filter the returned contacts  (optional) 
            var firstName = Ryan;  // string? | A first name value to filter the returned contacts  (optional) 
            var lastName = "lastName_example";  // string? | A last name value to filter the returned contacts  (optional) 

            try
            {
                // Get Contacts
                List<Contact> result = apiInstance.GetContacts(userId, email, firstName, lastName);
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
 **userId** | **string**| The id of the current user sending the request | 
 **email** | **string?**| An email value to filter the returned contacts  | [optional] 
 **firstName** | **string?**| A first name value to filter the returned contacts  | [optional] 
 **lastName** | **string?**| A last name value to filter the returned contacts  | [optional] 

### Return type

[**List&lt;Contact&gt;**](Contact.md)

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

<a name="getsubscription"></a>
# **GetSubscription**
> bool GetSubscription (string email, string userId)

Get Subscription

An end point that returns a boolean value indicating if the specified email is on the subscription list

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Contracts;

namespace Example
{
    public class GetSubscriptionExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var email = example@abc.com;  // string | The email of the subscription
            var userId = "userId_example";  // string | The id of the current user sending the request

            try
            {
                // Get Subscription
                bool result = apiInstance.GetSubscription(email, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.GetSubscription: " + e.Message );
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
 **userId** | **string**| The id of the current user sending the request | 

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
> List&lt;string&gt; GetSubscriptions (string userId)

Get Subscriptions

An end point that returns a list of emails on the subscription list

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Contracts;

namespace Example
{
    public class GetSubscriptionsExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var userId = "userId_example";  // string | The id of the current user sending the request

            try
            {
                // Get Subscriptions
                List<string> result = apiInstance.GetSubscriptions(userId);
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
 **userId** | **string**| The id of the current user sending the request | 

### Return type

**List<string>**

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
> CommandSuccessResponse Subscribe (string email, string userId, CreateContactRequest? createContactRequest)

Subscribe

Add a new email address to the subcription list

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Contracts;

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
            var userId = "userId_example";  // string | The id of the current user sending the request
            var createContactRequest = new CreateContactRequest?(); // CreateContactRequest? |  (optional) 

            try
            {
                // Subscribe
                CommandSuccessResponse result = apiInstance.Subscribe(email, userId, createContactRequest);
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
 **userId** | **string**| The id of the current user sending the request | 
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
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Contracts;

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
> CommandSuccessResponse UpdateContact (Guid id, string userId, ContactHeader? contactHeader)

Update Contact

An end point that updates an existing contact

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Contracts;

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
            var userId = PSUL;  // string | User Id sending request
            var contactHeader = new ContactHeader?(); // ContactHeader? |  (optional) 

            try
            {
                // Update Contact
                CommandSuccessResponse result = apiInstance.UpdateContact(id, userId, contactHeader);
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
 **userId** | **string**| User Id sending request | 
 **contactHeader** | [**ContactHeader?**](ContactHeader?.md)|  | [optional] 

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

