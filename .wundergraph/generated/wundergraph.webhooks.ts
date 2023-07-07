import type { WebhookConfiguration } from "@wundergraph/sdk/server";
import type { InternalClient } from "./wundergraph.internal.client";
import type { InternalOperationsClient } from "./wundergraph.internal.operations.client";
import type { ContextType } from "./wundergraph.factory";

import { createWebhookFactory } from "@wundergraph/sdk/server";
import type { ORM as TypedORM } from "./orm";

export type WebhooksConfig = {};

export const createWebhook = createWebhookFactory<InternalOperationsClient, InternalClient, ContextType, TypedORM>();
