import {
  IIntegrationEvent,
  IntegrationEvent,
} from "@open-system/core-server-services";
import { userVisitedEventSchema } from "./user-visited-event.schema";

@Event()
class UserVisitedEvent extends IntegrationEvent {
  public static eventType = "UserVisitedEvent";

  public static isMatch(event: IIntegrationEvent): event is UserVisitedEvent {
    return event.eventType === UserVisitedEvent.eventType;
  }

  #visitedOn: Date;
  #countryCode?: string;
  #continent?: string;
  #latitude?: string;
  #longitude?: string;
  #postalCode?: string;
  #city?: string;
  #state?: string;
  #timezone?: string;
  #ip?: string;
  #url: URL;

  constructor(input: {
    visitedOn: Date;
    countryCode?: string;
    continent?: string;
    latitude?: string;
    longitude?: string;
    postalCode?: string;
    city?: string;
    state?: string;
    timezone?: string;
    ip?: string;
    url: URL;
  }) {
    super(UserVisitedEvent.eventType, 1, "server-event");

    const values = userVisitedEventSchema.parse(input);

    this.#visitedOn =
      typeof values.visitedOn === "string" ||
      typeof values.visitedOn === "number"
        ? new Date(values.visitedOn)
        : values.visitedOn;
    this.#countryCode = values.countryCode;
    this.#continent = values.continent;
    this.#latitude = values.latitude;
    this.#longitude = values.longitude;
    this.#postalCode = values.postalCode;
    this.#city = values.city;
    this.#state = values.state;
    this.#timezone = values.timezone;
    this.#ip = values.ip;
    this.#url =
      typeof values.url === "string" ? new URL(values.url) : values.url;
  }

  public get visitedOn(): Date {
    return this.#visitedOn;
  }
  public set visitedOn(visitedOn: Date | string | number) {
    this.#visitedOn =
      typeof visitedOn === "string" || typeof visitedOn === "number"
        ? new Date(visitedOn)
        : visitedOn;
  }

  public get countryCode(): string | undefined {
    return this.#countryCode;
  }
  public set countryCode(countryCode: string | undefined) {
    this.#countryCode = countryCode;
  }

  public get continent(): string | undefined {
    return this.#continent;
  }
  public set continent(continent: string | undefined) {
    this.#continent = continent;
  }

  public get latitude(): string | undefined {
    return this.#latitude;
  }
  public set latitude(latitude: string | undefined) {
    this.#latitude = latitude;
  }

  public get longitude(): string | undefined {
    return this.#longitude;
  }
  public set longitude(longitude: string | undefined) {
    this.#longitude = longitude;
  }

  public get postalCode(): string | undefined {
    return this.#postalCode;
  }
  public set postalCode(postalCode: string | undefined) {
    this.#postalCode = postalCode;
  }

  public get city(): string | undefined {
    return this.#city;
  }
  public set city(city: string | undefined) {
    this.#city = city;
  }

  public get state(): string | undefined {
    return this.#state;
  }
  public set state(state: string | undefined) {
    this.#state = state;
  }

  public get timezone(): string | undefined {
    return this.#timezone;
  }
  public set timezone(timezone: string | undefined) {
    this.#timezone = timezone;
  }

  public get ip(): string | undefined {
    return this.#ip;
  }
  public set ip(ip: string | undefined) {
    this.#ip = ip;
  }

  public get url(): URL {
    return this.#url;
  }
  public set url(url: URL | string) {
    this.#url = typeof url === "string" ? new URL(url) : url;
  }

  public stringify(): string {
    let json = "{";
    if (this.visitedOn !== undefined) {
      json += `"visitedOn": ${this.visitedOn?.toISOString()},`;
    }
    if (this.countryCode !== undefined) {
      json += `"countryCode": ${this.countryCode},`;
    }
    if (this.continent !== undefined) {
      json += `"continent": ${this.continent},`;
    }
    if (this.latitude !== undefined) {
      json += `"latitude": ${this.latitude},`;
    }
    if (this.longitude !== undefined) {
      json += `"longitude": ${this.longitude},`;
    }
    if (this.postalCode !== undefined) {
      json += `"postalCode": ${this.postalCode},`;
    }
    if (this.city !== undefined) {
      json += `"city": ${this.city},`;
    }
    if (this.state !== undefined) {
      json += `"state": ${this.state},`;
    }
    if (this.timezone !== undefined) {
      json += `"timezone": ${this.timezone},`;
    }
    if (this.ip !== undefined) {
      json += `"ip": ${this.ip},`;
    }
    if (this.url !== undefined) {
      json += `"url": ${this.url?.toString()},`;
    }

    //Remove potential last comma
    return `${
      json.charAt(json.length - 1) === ","
        ? json.slice(0, json.length - 1)
        : json
    }}`;
  }

  public static parse(json: string | object): UserVisitedEvent {
    return new UserVisitedEvent(
      typeof json === "object" ? json : JSON.parse(json)
    );
  }
}
export { UserVisitedEvent };
