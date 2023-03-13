import {
  ResponseContext,
  RequestContext,
  HttpFile,
  HttpHandler,
  fetchHttpHandler,
  ConsoleLogger,
  BaseError,
} from '@open-system/core-typescript-utilities';
import { AddReactionRequest } from '../models';
import { CommandSuccessResponse } from '../models';
import { GetReactions200Response } from '../models';
import { GetReactions200ResponseAllOf } from '../models';
import { GetReactionsCount200Response } from '../models';
import { PagedQueryResponse } from '../models';
import { ProblemDetailsResponse } from '../models';
import { ProblemDetailsResponseField } from '../models';
import { ReactionCountRecord } from '../models';
import { ReactionDetailRecord } from '../models';
import { ReactionDetailRecordAllOf } from '../models';
import { RecordBase } from '../models';
import { ReactionApiRequestFactory, ReactionApiResponseProcessor} from "../parsers/ReactionApiParser";

const REQUEST_HANDLER: HttpHandler = fetchHttpHandler({
    baseUrl: `${ process.env.NEXT_PUBLIC_REACTION_API_HOST }/api/v1`,
  });


/**
 * addReaction
 * Send addReaction request to server
 */
export const addReaction = async ({ contentId = undefined, body  }: { contentId?: string; body?: AddReactionRequest;  },
  extraOptions?: any): Promise<{ response?: CommandSuccessResponse , error?: BaseError }> => {
  try {
    const request = ReactionApiRequestFactory.addReaction({
      contentId, body, 
    });

    ConsoleLogger.debug("Sending request:");
    request && ConsoleLogger.debug(JSON.stringify(request));

    extraOptions && ConsoleLogger.debug("Request extra options:");
    extraOptions && ConsoleLogger.debug(JSON.stringify(extraOptions));

    const response = await REQUEST_HANDLER(request,
      undefined,
      extraOptions
    );

    ConsoleLogger.debug("Received response:");
    response && ConsoleLogger.debug(JSON.stringify(response));

    return {
      response: await ReactionApiResponseProcessor.addReaction(response.data)
    };
  } catch (error) {
    ConsoleLogger.error("Error sending request:");
    error && ConsoleLogger.error(JSON.stringify(error));

    return { error: error as BaseError };
  }
};

/**
 * getReactions
 * Send getReactions request to server
 */
export const getReactions = async ({ contentId = undefined, pageNumber = 1, pageSize = 200, orderBy = 'id', type = undefined }: { contentId?: string; pageNumber?: number; pageSize?: number; orderBy?: string; type?: 'like' | 'dislike' | 'laugh' | 'cry';  },
  extraOptions?: any): Promise<{ response?: GetReactions200Response , error?: BaseError }> => {
  try {
    const request = ReactionApiRequestFactory.getReactions({
      contentId, pageNumber, pageSize, orderBy, type, 
    });

    ConsoleLogger.debug("Sending request:");
    request && ConsoleLogger.debug(JSON.stringify(request));

    extraOptions && ConsoleLogger.debug("Request extra options:");
    extraOptions && ConsoleLogger.debug(JSON.stringify(extraOptions));

    const response = await REQUEST_HANDLER(request,
      undefined,
      extraOptions
    );

    ConsoleLogger.debug("Received response:");
    response && ConsoleLogger.debug(JSON.stringify(response));

    return {
      response: await ReactionApiResponseProcessor.getReactions(response.data)
    };
  } catch (error) {
    ConsoleLogger.error("Error sending request:");
    error && ConsoleLogger.error(JSON.stringify(error));

    return { error: error as BaseError };
  }
};

/**
 * getReactionsCount
 * Send getReactionsCount request to server
 */
export const getReactionsCount = async ({ contentId = undefined, type = undefined }: { contentId?: string; type?: 'like' | 'dislike' | 'laugh' | 'cry';  },
  extraOptions?: any): Promise<{ response?: GetReactionsCount200Response , error?: BaseError }> => {
  try {
    const request = ReactionApiRequestFactory.getReactionsCount({
      contentId, type, 
    });

    ConsoleLogger.debug("Sending request:");
    request && ConsoleLogger.debug(JSON.stringify(request));

    extraOptions && ConsoleLogger.debug("Request extra options:");
    extraOptions && ConsoleLogger.debug(JSON.stringify(extraOptions));

    const response = await REQUEST_HANDLER(request,
      undefined,
      extraOptions
    );

    ConsoleLogger.debug("Received response:");
    response && ConsoleLogger.debug(JSON.stringify(response));

    return {
      response: await ReactionApiResponseProcessor.getReactionsCount(response.data)
    };
  } catch (error) {
    ConsoleLogger.error("Error sending request:");
    error && ConsoleLogger.error(JSON.stringify(error));

    return { error: error as BaseError };
  }
};

/**
 * removeReaction
 * Send removeReaction request to server
 */
export const removeReaction = async ({ contentId = undefined }: { contentId?: string;  },
  extraOptions?: any): Promise<{ response?: CommandSuccessResponse , error?: BaseError }> => {
  try {
    const request = ReactionApiRequestFactory.removeReaction({
      contentId, 
    });

    ConsoleLogger.debug("Sending request:");
    request && ConsoleLogger.debug(JSON.stringify(request));

    extraOptions && ConsoleLogger.debug("Request extra options:");
    extraOptions && ConsoleLogger.debug(JSON.stringify(extraOptions));

    const response = await REQUEST_HANDLER(request,
      undefined,
      extraOptions
    );

    ConsoleLogger.debug("Received response:");
    response && ConsoleLogger.debug(JSON.stringify(response));

    return {
      response: await ReactionApiResponseProcessor.removeReaction(response.data)
    };
  } catch (error) {
    ConsoleLogger.error("Error sending request:");
    error && ConsoleLogger.error(JSON.stringify(error));

    return { error: error as BaseError };
  }
};

