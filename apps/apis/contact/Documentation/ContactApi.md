# OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers.ContactApi

All URIs are relative to *api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AddContactRequest**](ContactApi.md#addcontactrequest) | **HttpPost** /requests/{id} | Add Contact Request
[**GetContactRequest**](ContactApi.md#getcontactrequest) | **HttpGet** /requests/{id} | Get Contact Request
[**GetContactRequests**](ContactApi.md#getcontactrequests) | **HttpGet** /requests | Get Contact Requests
[**GetSubscription**](ContactApi.md#getsubscription) | **HttpGet** /subscriptions/{email} | Get Subscription
[**GetSubscriptions**](ContactApi.md#getsubscriptions) | **HttpGet** /subscriptions | Get Subscriptions
[**Subscribe**](ContactApi.md#subscribe) | **HttpPost** /subscriptions/{email} | Subscribe
[**Unsubscribe**](ContactApi.md#unsubscribe) | **HttpDelete** /subscriptions/{email} | Unsubscribe


<a name="addcontactrequest"></a>
# **AddContactRequest**
> UpdateSuccessResponseDto AddContactRequest (Guid id, string userId, ContactDetailDto? contactDetailDto)

Add Contact Request

Add a new contact request

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Contracts;

namespace Example
{
    public class AddContactRequestExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var id = "id_example";  // Guid | The reason for the current contact request
            var userId = "userId_example";  // string | The id of the current user sending the request
            var contactDetailDto = new ContactDetailDto?(); // ContactDetailDto? |  (optional) 

            try
            {
                // Add Contact Request
                UpdateSuccessResponseDto result = apiInstance.AddContactRequest(id, userId, contactDetailDto);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.AddContactRequest: " + e.Message );
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
 **id** | **Guid**| The reason for the current contact request | 
 **userId** | **string**| The id of the current user sending the request | 
 **contactDetailDto** | [**ContactDetailDto?**](ContactDetailDto?.md)|  | [optional] 

### Return type

[**UpdateSuccessResponseDto**](UpdateSuccessResponseDto.md)

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

<a name="getcontactrequest"></a>
# **GetContactRequest**
> ContactDto GetContactRequest (Guid id, string userId)

Get Contact Request

An end point that returns data for a specific user

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Contracts;

namespace Example
{
    public class GetContactRequestExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var id = "id_example";  // Guid | The reason for the current contact request
            var userId = "userId_example";  // string | The id of the current user sending the request

            try
            {
                // Get Contact Request
                ContactDto result = apiInstance.GetContactRequest(id, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.GetContactRequest: " + e.Message );
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
 **id** | **Guid**| The reason for the current contact request | 
 **userId** | **string**| The id of the current user sending the request | 

### Return type

[**ContactDto**](ContactDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response to Get User end point |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getcontactrequests"></a>
# **GetContactRequests**
> List&lt;ContactDto&gt; GetContactRequests (string userId)

Get Contact Requests

An end point that returns the list of contact requests

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Controllers;
using OpenSystem.Apis.Contact.Client;
using OpenSystem.Apis.Contact.OpenSystem.Apis.Contact.Contracts;

namespace Example
{
    public class GetContactRequestsExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ContactApi(config);
            var userId = "userId_example";  // string | The id of the current user sending the request

            try
            {
                // Get Contact Requests
                List<ContactDto> result = apiInstance.GetContactRequests(userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ContactApi.GetContactRequests: " + e.Message );
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

[**List&lt;ContactDto&gt;**](ContactDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response to Get Users end point |  -  |
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
> UpdateSuccessResponseDto Subscribe (string email, string userId, ContactDetailDto? contactDetailDto)

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
            var contactDetailDto = new ContactDetailDto?(); // ContactDetailDto? |  (optional) 

            try
            {
                // Subscribe
                UpdateSuccessResponseDto result = apiInstance.Subscribe(email, userId, contactDetailDto);
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
 **contactDetailDto** | [**ContactDetailDto?**](ContactDetailDto?.md)|  | [optional] 

### Return type

[**UpdateSuccessResponseDto**](UpdateSuccessResponseDto.md)

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
> UpdateSuccessResponseDto Unsubscribe (string email)

Unsubscribe

Add an existing email address from the subcription list

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
                UpdateSuccessResponseDto result = apiInstance.Unsubscribe(email);
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

[**UpdateSuccessResponseDto**](UpdateSuccessResponseDto.md)

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

