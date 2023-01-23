import { INVERSION_CONTAINER } from "@open-system/core-typescript-utilities";
import { ApiServiceBinder as EngagementApiServiceBinder } from "@open-system/reaction-ui-data-access";
import { UserDataServiceBinder } from "@open-system/shared-ui-data-access";

UserDataServiceBinder.with(INVERSION_CONTAINER);
EngagementApiServiceBinder.with(INVERSION_CONTAINER);
