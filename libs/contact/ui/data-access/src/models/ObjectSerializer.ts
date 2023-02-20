import { Address } from './Address';
import { CommandSuccessResponse } from './CommandSuccessResponse';
import { ContactDetailRecord  , ContactDetailRecordReasonEnum     } from './ContactDetailRecord';
import { ContactHeaderRecord } from './ContactHeaderRecord';
import { ContactHeaderRecordAllOf } from './ContactHeaderRecordAllOf';
import { ContactRecord } from './ContactRecord';
import { CreateContactRequest             , CreateContactRequestReasonEnum     } from './CreateContactRequest';
import { GetContactDetails200Response } from './GetContactDetails200Response';
import { GetContactDetails200ResponseAllOf } from './GetContactDetails200ResponseAllOf';
import { GetContacts200Response } from './GetContacts200Response';
import { GetContacts200ResponseAllOf } from './GetContacts200ResponseAllOf';
import { GetSubscriptions200Response } from './GetSubscriptions200Response';
import { GetSubscriptions200ResponseAllOf } from './GetSubscriptions200ResponseAllOf';
import { PagedQueryResponse } from './PagedQueryResponse';
import { ProblemDetailsResponse } from './ProblemDetailsResponse';
import { RecordBase } from './RecordBase';

export const enumsMap: Set<string> = new Set<string>([
    "ContactDetailRecordReasonEnum",
    "CreateContactRequestReasonEnum",
]);

export const typeMap: {[index: string]: any} = {
    "Address": Address,
    "CommandSuccessResponse": CommandSuccessResponse,
    "ContactDetailRecord": ContactDetailRecord,
    "ContactHeaderRecord": ContactHeaderRecord,
    "ContactHeaderRecordAllOf": ContactHeaderRecordAllOf,
    "ContactRecord": ContactRecord,
    "CreateContactRequest": CreateContactRequest,
    "GetContactDetails200Response": GetContactDetails200Response,
    "GetContactDetails200ResponseAllOf": GetContactDetails200ResponseAllOf,
    "GetContacts200Response": GetContacts200Response,
    "GetContacts200ResponseAllOf": GetContacts200ResponseAllOf,
    "GetSubscriptions200Response": GetSubscriptions200Response,
    "GetSubscriptions200ResponseAllOf": GetSubscriptions200ResponseAllOf,
    "PagedQueryResponse": PagedQueryResponse,
    "ProblemDetailsResponse": ProblemDetailsResponse,
    "RecordBase": RecordBase,
}
