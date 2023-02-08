"use client";

import { selectContactFormCreatedDateTime } from "@open-system/contact-ui-data-access";
import { ContactTypeForm } from "@open-system/contact-ui-feature-form";
import { isEmpty } from "@open-system/core-typescript-utilities";
import { addInfoNotification } from "@open-system/shared-ui-data-access";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Page() {
  const createdDateTime = useSelector(selectContactFormCreatedDateTime);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(createdDateTime)) {
      dispatch(
        addInfoNotification(
          `Reloaded details previously added on ${createdDateTime
            ?.getPlainDate()
            .toLocaleString()} at ${createdDateTime
            ?.getPlainTime()
            .toLocaleString(undefined, { timeStyle: "short" })}`
        )
      );
    }
  }, []);

  return <ContactTypeForm />;
}
