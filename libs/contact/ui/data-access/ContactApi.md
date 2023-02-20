# .ContactApi

All URIs are relative to *http://localhost:5000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createContact**](ContactApi.md#createContact) | **POST** /contacts | Create Contact
[**createContactDetail**](ContactApi.md#createContactDetail) | **POST** /contacts/{id}/details | Create Contact Detail
[**getContactById**](ContactApi.md#getContactById) | **GET** /contacts/{id} | Get Contact By Id
[**getContactDetails**](ContactApi.md#getContactDetails) | **GET** /contacts/{id}/details | Get Contact Details
[**getContacts**](ContactApi.md#getContacts) | **GET** /contacts | Get Contacts
[**getSubscriptionByEmail**](ContactApi.md#getSubscriptionByEmail) | **GET** /contacts/subscriptions/{email} | Get Subscription By Email
[**getSubscriptions**](ContactApi.md#getSubscriptions) | **GET** /contacts/subscriptions | Get Subscriptions
[**subscribe**](ContactApi.md#subscribe) | **POST** /contacts/subscriptions/{email} | Subscribe
[**unsubscribe**](ContactApi.md#unsubscribe) | **DELETE** /contacts/subscriptions/{email} | Unsubscribe
[**updateContact**](ContactApi.md#updateContact) | **PUT** /contacts/{id} | Update Contact


# **createContact**
> CommandSuccessResponse createContact()

Add a new contact

### Example


```typescript
import {  } from 'contact-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactApi(configuration);

let body:.ContactApiCreateContactRequest = {
  // CreateContactRequest |  (optional)
  createContactRequest: null,
};

apiInstance.createContact(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createContactRequest** | **CreateContactRequest**|  |


### Return type

**CommandSuccessResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **createContactDetail**
> CommandSuccessResponse createContactDetail()

An end point that adds a new detail to an existing contact

### Example


```typescript
import {  } from 'contact-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactApi(configuration);

let body:.ContactApiCreateContactDetailRequest = {
  // string | The records guid
  id: "123e4567-e89b-12d3-a456-426614174000",
};

apiInstance.createContactDetail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] | The records guid | defaults to undefined


### Return type

**CommandSuccessResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getContactById**
> ContactRecord getContactById()

An end point that returns data for a specific contact

### Example


```typescript
import {  } from 'contact-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactApi(configuration);

let body:.ContactApiGetContactByIdRequest = {
  // string | The records guid
  id: "123e4567-e89b-12d3-a456-426614174000",
};

apiInstance.getContactById(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] | The records guid | defaults to undefined


### Return type

**ContactRecord**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getContactDetails**
> GetContactDetails200Response getContactDetails()

An end point that returns detail data for a specific contact

### Example


```typescript
import {  } from 'contact-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactApi(configuration);

let body:.ContactApiGetContactDetailsRequest = {
  // string | The records guid
  id: "123e4567-e89b-12d3-a456-426614174000",
  // number | The current page number of the selected data
  pageNumber: 1,
  // number | The maximum amount of data to return in one request
  pageSize: 200,
  // string | The field to filter data by
  orderBy: "details",
  // 'business' | 'question' | 'other' | 'project' | 'interest' | An reason type value to filter the returned contact details  (optional)
  reason: "business",
};

apiInstance.getContactDetails(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] | The records guid | defaults to undefined
 **pageNumber** | [**number**] | The current page number of the selected data | defaults to 1
 **pageSize** | [**number**] | The maximum amount of data to return in one request | defaults to 200
 **orderBy** | [**string**] | The field to filter data by | defaults to 'details'
 **reason** | [**&#39;business&#39; | &#39;question&#39; | &#39;other&#39; | &#39;project&#39; | &#39;interest&#39;**]**Array<&#39;business&#39; &#124; &#39;question&#39; &#124; &#39;other&#39; &#124; &#39;project&#39; &#124; &#39;interest&#39;>** | An reason type value to filter the returned contact details  | (optional) defaults to undefined


### Return type

**GetContactDetails200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getContacts**
> GetContacts200Response getContacts()

An end point that returns the list of contacts

### Example


```typescript
import {  } from 'contact-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactApi(configuration);

let body:.ContactApiGetContactsRequest = {
  // number | The current page number of the selected data
  pageNumber: 1,
  // number | The maximum amount of data to return in one request
  pageSize: 200,
  // string | The field to order the records by
  orderBy: "email",
  // string | An email value to filter the returned contacts  (optional)
  email: "john@example.com",
  // string | A first name value to filter the returned contacts  (optional)
  firstName: "Ryan",
  // string | A last name value to filter the returned contacts  (optional)
  lastName: "lastName_example",
};

apiInstance.getContacts(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pageNumber** | [**number**] | The current page number of the selected data | defaults to 1
 **pageSize** | [**number**] | The maximum amount of data to return in one request | defaults to 200
 **orderBy** | [**string**] | The field to order the records by | defaults to 'email'
 **email** | [**string**] | An email value to filter the returned contacts  | (optional) defaults to undefined
 **firstName** | [**string**] | A first name value to filter the returned contacts  | (optional) defaults to undefined
 **lastName** | [**string**] | A last name value to filter the returned contacts  | (optional) defaults to undefined


### Return type

**GetContacts200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getSubscriptionByEmail**
> boolean getSubscriptionByEmail()

An end point that returns a boolean value indicating if the specified email is on the subscription list

### Example


```typescript
import {  } from 'contact-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactApi(configuration);

let body:.ContactApiGetSubscriptionByEmailRequest = {
  // string | The email of the subscription
  email: "example@abc.com",
};

apiInstance.getSubscriptionByEmail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **email** | [**string**] | The email of the subscription | defaults to undefined


### Return type

**boolean**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getSubscriptions**
> GetSubscriptions200Response getSubscriptions()

An end point that returns a list of emails on the subscription list

### Example


```typescript
import {  } from 'contact-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactApi(configuration);

let body:.ContactApiGetSubscriptionsRequest = {
  // number | The current page number of the selected data
  pageNumber: 1,
  // number | The maximum amount of data to return in one request
  pageSize: 200,
  // string | The field to order the data by
  orderBy: "email",
};

apiInstance.getSubscriptions(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pageNumber** | [**number**] | The current page number of the selected data | defaults to 1
 **pageSize** | [**number**] | The maximum amount of data to return in one request | defaults to 200
 **orderBy** | [**string**] | The field to order the data by | defaults to 'email'


### Return type

**GetSubscriptions200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **subscribe**
> CommandSuccessResponse subscribe()

Add a new email address to the subcription list

### Example


```typescript
import {  } from 'contact-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactApi(configuration);

let body:.ContactApiSubscribeRequest = {
  // string | The email of the subscription
  email: "example@abc.com",
};

apiInstance.subscribe(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **email** | [**string**] | The email of the subscription | defaults to undefined


### Return type

**CommandSuccessResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **unsubscribe**
> CommandSuccessResponse unsubscribe()

Remove an existing email address from the subcription list

### Example


```typescript
import {  } from 'contact-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactApi(configuration);

let body:.ContactApiUnsubscribeRequest = {
  // string | The email of the subscription
  email: "example@abc.com",
};

apiInstance.unsubscribe(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **email** | [**string**] | The email of the subscription | defaults to undefined


### Return type

**CommandSuccessResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateContact**
> CommandSuccessResponse updateContact()

An end point that updates an existing contact

### Example


```typescript
import {  } from 'contact-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactApi(configuration);

let body:.ContactApiUpdateContactRequest = {
  // string | The records guid
  id: "123e4567-e89b-12d3-a456-426614174000",
  // ContactHeaderRecord |  (optional)
  contactHeaderRecord: ,
};

apiInstance.updateContact(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contactHeaderRecord** | **ContactHeaderRecord**|  |
 **id** | [**string**] | The records guid | defaults to undefined


### Return type

**CommandSuccessResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


