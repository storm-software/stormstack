"use client";

import {
  Contact,
  useContactValue,
  useResetContact,
  useSetContact,
} from "@open-system/contact-data-access";
import { ContactFormSegments } from "@open-system/contact-feature-form";
import { Link, Modal, ModalReference } from "@open-system/core-components";
import { Form, SubmitButton } from "@open-system/core-feature-form";
import {
  BaseComponentProps,
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonTypes,
  ButtonVariants,
  ModalVariants,
  ProgressTracker,
  ProgressTrackerItemStatus,
} from "@open-system/design-system-components";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useTransition } from "react";

export interface ContactFormProps extends BaseComponentProps {
  nextPathname?: string;
  previousPathname?: string;
}

export default function ContactForm({
  children,
  className,
  nextPathname,
  previousPathname,
  ...props
}: ContactFormProps) {
  const pathname = usePathname();
  const segment = pathname?.split("/")?.length
    ? pathname.split("/").at(-1)
    : null;

  const router = useRouter();

  const setContact = useSetContact();
  const resetContact = useResetContact();
  const contact = useContactValue();
  const [, startTransition] = useTransition();

  useEffect(() => {
    nextPathname && router.prefetch(nextPathname as any);
    previousPathname && router.prefetch(previousPathname as any);
  }, [router, nextPathname, previousPathname]);

  // const [createContact] = useCreateContactMutation();
  const handleSubmit = useCallback(
    async (formData: Contact) => {
      if (segment === ContactFormSegments.REVIEW) {
        startTransition(() => {
          //props.handleSubmit(formData);
          resetContact();
        });
      } else {
        /*const nextContact: Contact = {} as Contact;
        formData.forEach((value, key) => {
          nextContact[key] = value;
        });*/

        setContact({ ...formData, draftSavedDateTime: undefined });
      }

      nextPathname && router.push(nextPathname as any);
    },
    [
      nextPathname,
      router,
      segment,
      setContact,
      resetContact
    ]
  );

  const modalRef = useRef<ModalReference>(null);
  const handleResetOpen = useCallback(() => {
    modalRef.current?.open();
  }, []);
  const handleResetClose = useCallback(() => {
    modalRef.current?.close();
  }, []);

  const handleReset = useCallback(() => {
    resetContact();
    router.replace("/contact");
  }, [resetContact, router]);

  const handlePrevious = useCallback(() => {
    previousPathname && router.push(previousPathname as any);
  }, [previousPathname, router]);

  return (
    <>
      <Form<Contact>
        className="flex flex-col gap-8"
        onSubmit={handleSubmit}
        resetOnSubmit={false}
        defaultValues={contact}>
        <motion.div
          layout
          className={clsx(
            "flex flex-row items-center justify-between gap-20",
            className
          )}>
          <AnimatePresence>
            <motion.div
              className="flex h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}>
              {children}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col gap-8">
            <ProgressTracker
              items={[
                {
                  name: ContactFormSegments.REASON,
                  label: "Reason",
                  status:
                    segment === ContactFormSegments.PERSONAL_INFO ||
                    segment === ContactFormSegments.DETAILS ||
                    segment === ContactFormSegments.SUCCESS ||
                    segment === ContactFormSegments.REVIEW ||
                    segment === ContactFormSegments.SUCCESS
                      ? ProgressTrackerItemStatus.COMPLETE
                      : ProgressTrackerItemStatus.ACTIVE,
                  onClick:
                    segment !== ContactFormSegments.SUCCESS
                      ? () => router.replace("/contact")
                      : undefined,
                },
                {
                  name: ContactFormSegments.PERSONAL_INFO,
                  label: "Personal Info.",
                  status:
                    segment === ContactFormSegments.DETAILS ||
                    segment === ContactFormSegments.SUCCESS ||
                    segment === ContactFormSegments.REVIEW
                      ? ProgressTrackerItemStatus.COMPLETE
                      : segment === ContactFormSegments.PERSONAL_INFO
                      ? ProgressTrackerItemStatus.ACTIVE
                      : ProgressTrackerItemStatus.PENDING,
                  onClick:
                    segment !== ContactFormSegments.SUCCESS
                      ? () =>
                          pathname &&
                          router.replace(
                            `${pathname.substring(
                              0,
                              pathname.lastIndexOf("/")
                            )}/${ContactFormSegments.PERSONAL_INFO}` as any
                          )
                      : undefined,
                },
                {
                  name: ContactFormSegments.DETAILS,
                  label: "Details",
                  status:
                    segment === ContactFormSegments.SUCCESS ||
                    segment === ContactFormSegments.REVIEW
                      ? ProgressTrackerItemStatus.COMPLETE
                      : segment === ContactFormSegments.DETAILS
                      ? ProgressTrackerItemStatus.ACTIVE
                      : ProgressTrackerItemStatus.PENDING,
                  onClick:
                    segment !== ContactFormSegments.SUCCESS
                      ? () =>
                          pathname &&
                          router.replace(
                            `${pathname.substring(
                              0,
                              pathname.lastIndexOf("/")
                            )}/${ContactFormSegments.DETAILS}` as any
                          )
                      : undefined,
                },
                {
                  name: ContactFormSegments.REVIEW,
                  label: "Submit",
                  status:
                    segment === ContactFormSegments.SUCCESS
                      ? ProgressTrackerItemStatus.COMPLETE
                      : segment === ContactFormSegments.REVIEW
                      ? ProgressTrackerItemStatus.ACTIVE
                      : ProgressTrackerItemStatus.PENDING,
                  onClick:
                    segment !== ContactFormSegments.SUCCESS
                      ? () =>
                          pathname &&
                          router.replace(
                            `${pathname.substring(
                              0,
                              pathname.lastIndexOf("/")
                            )}/${ContactFormSegments.REVIEW}` as any
                          )
                      : undefined,
                },
              ]}
            />
          </div>
        </motion.div>
        <div className="flex flex-row-reverse justify-between">
          {segment !== ContactFormSegments.SUCCESS && nextPathname && (
            <SubmitButton
              variant={ButtonVariants.SECONDARY}
              rounding={ButtonCornerRoundingTypes.PARTIAL}
              transitionDirection={ButtonTransitionDirections.TOP}
              hoverText={
                segment === ContactFormSegments.REVIEW ? "Send" : "Next"
              }>
              {segment === ContactFormSegments.REVIEW ? "Submit" : "Continue"}
            </SubmitButton>
          )}
          {segment === ContactFormSegments.SUCCESS && (
            <Link className="h-fit w-fit">
              <Button
                variant={ButtonVariants.PRIMARY}
                rounding={ButtonCornerRoundingTypes.PARTIAL}
                transitionDirection={ButtonTransitionDirections.TOP}
                hoverText="Home">
                Home
              </Button>
            </Link>
          )}
          {segment &&
            segment !== ContactFormSegments.REASON &&
            segment !== ContactFormSegments.SUCCESS && (
              <div className="flex flex-row gap-8">
                {previousPathname && (
                  <Link href={previousPathname} className="h-fit w-fit">
                    <Button
                      variant={ButtonVariants.TERTIARY}
                      onClick={handlePrevious}
                      rounding={ButtonCornerRoundingTypes.PARTIAL}
                      transitionDirection={ButtonTransitionDirections.TOP}
                      hoverText="Back">
                      Previous
                    </Button>
                  </Link>
                )}
                <Button
                  variant={ButtonVariants.QUARTERNARY}
                  onClick={handleResetOpen}
                  rounding={ButtonCornerRoundingTypes.PARTIAL}
                  transitionDirection={ButtonTransitionDirections.TOP}
                  hoverText="Clear">
                  Reset
                </Button>
              </div>
            )}
        </div>
        <Modal
          className="h-fit min-h-fit w-[45rem]"
          ref={modalRef}
          initialOpened={false}
          variant={ModalVariants.WARNING}
          title="Reset Contact Information"
          onClose={handleResetClose}>
          <div className="flex flex-col gap-10">
            <div className="flex flex-1 grow">
            <div className="flex flex-col gap-2">
              <label className="whitespace-pre-wrap text-xl font-label-1 text-primary">
                Are you sure you want to remove all of your previously entered
                data?
              </label>
              <label className="whitespace-pre-wrap text-lg font-body-1 text-body-1">
                Selecting &quot;Reset&quot; below will start the contact
                process from the beginning.
              </label>
              </div>
            </div>
            <div className="shink flex flex-row-reverse gap-8">
              <Button
                variant={ButtonVariants.PRIMARY}
                type={ButtonTypes.RESET}
                onClick={handleReset}
                rounding={ButtonCornerRoundingTypes.NONE}
                transitionDirection={ButtonTransitionDirections.NONE}
                inverse={true}
                hoverText="Confirm">
                Reset
              </Button>
              <Button
                variant={ButtonVariants.PRIMARY}
                onClick={handleResetClose}
                rounding={ButtonCornerRoundingTypes.NONE}
                transitionDirection={ButtonTransitionDirections.NONE}
                hoverText="Cancel">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </Form>
    </>
  );
}
