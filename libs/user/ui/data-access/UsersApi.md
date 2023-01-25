# .UsersApi

All URIs are relative to *http://localhost:5000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addUser**](UsersApi.md#addUser) | **POST** /users/{userId} | Add User
[**deleteUser**](UsersApi.md#deleteUser) | **DELETE** /users/{userId} | Remove User
[**getUser**](UsersApi.md#getUser) | **GET** /users/{userId} | Get User
[**getUsers**](UsersApi.md#getUsers) | **GET** /users | Get Users
[**updateUser**](UsersApi.md#updateUser) | **PUT** /users/{userId} | Update User


# **addUser**
> UpdateSuccessResponseDto addUser()

Add a new user

### Example


```typescript
import {  } from 'user-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .UsersApi(configuration);

let body:.UsersApiAddUserRequest = {
  // string | The unique Id used to identify the user
  userId: "userId_example",
  // UpdateUserRequestDto |  (optional)
  updateUserRequestDto: {
    name: "Guest",
    type: "guest",
  },
};

apiInstance.addUser(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateUserRequestDto** | **UpdateUserRequestDto**|  |
 **userId** | [**string**] | The unique Id used to identify the user | defaults to undefined


### Return type

**UpdateSuccessResponseDto**

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

# **deleteUser**
> UpdateSuccessResponseDto deleteUser()

Remove an existing user from the system

### Example


```typescript
import {  } from 'user-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .UsersApi(configuration);

let body:.UsersApiDeleteUserRequest = {
  // string | The unique Id used to identify the user
  userId: "userId_example",
};

apiInstance.deleteUser(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**string**] | The unique Id used to identify the user | defaults to undefined


### Return type

**UpdateSuccessResponseDto**

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

# **getUser**
> UserDto getUser()

An end point that returns data for a specific user

### Example


```typescript
import {  } from 'user-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .UsersApi(configuration);

let body:.UsersApiGetUserRequest = {
  // string | The unique Id used to identify the user
  userId: "userId_example",
};

apiInstance.getUser(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**string**] | The unique Id used to identify the user | defaults to undefined


### Return type

**UserDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response to Get User end point |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getUsers**
> Array<UserDto> getUsers()

An end point that returns the list of users in the system

### Example


```typescript
import {  } from 'user-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .UsersApi(configuration);

let body:.UsersApiGetUsersRequest = {
  // string | The unique Id used to identify the user
  userId: "userId_example",
  // 'guest' | 'internal' | 'external' | The type of the user (optional)
  type: "guest",
};

apiInstance.getUsers(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**string**] | The unique Id used to identify the user | defaults to undefined
 **type** | [**&#39;guest&#39; | &#39;internal&#39; | &#39;external&#39;**]**Array<&#39;guest&#39; &#124; &#39;internal&#39; &#124; &#39;external&#39;>** | The type of the user | (optional) defaults to undefined


### Return type

**Array<UserDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response to Get Users end point |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateUser**
> UpdateSuccessResponseDto updateUser()

Update an existing user

### Example


```typescript
import {  } from 'user-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .UsersApi(configuration);

let body:.UsersApiUpdateUserRequest = {
  // string | The unique Id used to identify the user
  userId: "userId_example",
  // UpdateUserRequestDto |  (optional)
  updateUserRequestDto: {
    name: "Guest",
    type: "guest",
  },
};

apiInstance.updateUser(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateUserRequestDto** | **UpdateUserRequestDto**|  |
 **userId** | [**string**] | The unique Id used to identify the user | defaults to undefined


### Return type

**UpdateSuccessResponseDto**

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


