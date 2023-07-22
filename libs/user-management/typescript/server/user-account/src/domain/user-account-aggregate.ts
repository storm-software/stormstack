import {
  AggregateRoot,
  IAggregateRoot,
  IDomainEvent,
} from "@open-system/core-server-services";
import { UserTypes } from "@open-system/user-management-shared-data-access";

/**
 * A base abstract class to be inherited by all utility classes added.
 *
 * @remarks This class implements core functionality such as the id and symbol properties
 */
export class UserAccountAggregate extends AggregateRoot {
  public userVisit = () => {
    this.emit(new UserAccountVisitedApplicationEvent());
  };

  public constructor(
    id: string,
    public userName: string,
    public userType: UserTypes = UserTypes.GUEST
  ) {
    super(id);
  }

  protected override innerApply = <
    TAggregate extends IAggregateRoot = UserAccountAggregate
  >(
    event: IDomainEvent<TAggregate>
  ) => {
    switch (event.type) {
      case "UserAccountCreated":
        this.userName = event.data.userName;
        this.userType = event.data.userType ?? UserTypes.GUEST;
        break;
      case "UserAccountUserNameUpdated":
        this.userName = event.data.userName;
        break;
      case "UserAccountUserTypeUpdated":
        this.userType = event.data.userType ?? UserTypes.GUEST;
        break;
    }
  };
}
