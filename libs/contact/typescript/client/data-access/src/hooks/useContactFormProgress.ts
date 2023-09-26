import {
  useAtomList,
  useFormValues
} from "@stormstack/core-client-data-access";
import { ProgressTrackerItemStatus } from "@stormstack/design-system-components";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  ContactFormProgressStep,
  contactFormProgressAtom
} from "../state/contact-form-progress";
import { getDefaultContactSteps } from "../utilities/get-default-contact-steps";
import { useResetContact, useSetContact } from "./useContact";

export type UseSetContactFormProgressReturn = {
  next: () => void;
  previous: () => void;
  goToStep: (index: number, saveContact?: boolean) => void;
  reset: (reason?: string) => void;
};

export const useSetContactFormProgress =
  (): UseSetContactFormProgressReturn => {
    const setContact = useSetContact();
    const resetContact = useResetContact();
    const values = useFormValues();
    const router = useRouter();

    const { map, reset } = useAtomList(contactFormProgressAtom);
    const contactFormStepList = useAtomValue(contactFormProgressAtom);

    const handleGoToStep = useCallback(
      (index: number, saveContact = true) => {
        saveContact && setContact(values);

        map((contactFormStep: ContactFormProgressStep, i: number) => ({
          ...contactFormStep,
          status:
            index === i
              ? ProgressTrackerItemStatus.ACTIVE
              : index > i
              ? ProgressTrackerItemStatus.COMPLETE
              : ProgressTrackerItemStatus.PENDING
        }));

        contactFormStepList &&
          contactFormStepList[index] &&
          typeof contactFormStepList[index].pathname === "string" &&
          router.replace(contactFormStepList[index].pathname as string);
      },
      [contactFormStepList, values, router, map, setContact]
    );

    const handleNext = useCallback(() => {
      const active = contactFormStepList.findIndex(
        (contactFormStep: ContactFormProgressStep) =>
          contactFormStep.status === ProgressTrackerItemStatus.ACTIVE
      );

      handleGoToStep(active + 1);
    }, [contactFormStepList, handleGoToStep]);

    const handlePrevious = useCallback(() => {
      const active = contactFormStepList.findIndex(
        (contactFormStep: ContactFormProgressStep) =>
          contactFormStep.status === ProgressTrackerItemStatus.ACTIVE
      );

      handleGoToStep(active - 1);
    }, [contactFormStepList, handleGoToStep]);

    const handleReset = useCallback(
      (reason?: string) => {
        const steps = getDefaultContactSteps(reason);
        reset(steps);
        if (reason) {
          // handleGoToStep(1, false);
        } else {
          resetContact();
          router.replace("/contact");
        }
      },
      [reset, resetContact, router, handleGoToStep]
    );

    return {
      next: handleNext,
      previous: handlePrevious,
      goToStep: handleGoToStep,
      reset: handleReset
    };
  };
