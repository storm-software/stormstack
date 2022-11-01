# OpenSystem.Apis.Message.OpenSystem.Apis.Message.Contracts.MessageDto
A `Message` record returned from the server

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Guid** | **Guid** | The &#x60;guid&#x60; associated with the record | 
**CreatedOn** | **DateTimeOffset** |  | 
**CreatedBy** | **string** |  | 
**UpdatedOn** | **DateTimeOffset** |  | [optional] 
**UpdatedBy** | **string** |  | [optional] 
**Message** | **string** |  | 
**MessageType** | **string** |  | [default to MessageTypeOptions.FXL]
**MessageNumber** | **int** |  | 
**Culture** | **string** |  | [default to CultureOptions.ENUS]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

