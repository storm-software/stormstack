import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonTypes,
  ButtonVariants,
  Radio,
} from "@open-system/design-system-components";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row items-center gap-8">
        <div className="flex flex-col gap-2">
          <label className="font-header-4 text-xl text-violet-500">
            Contact Reason
          </label>
          <h2 className="font-label-3 text-3xl text-primary">
            What do you want to start a conversation about?
          </h2>
        </div>
        <div className="flex grow flex-col gap-8">
          <Radio
            name="reason"
            label={null}
            required={true}
            isVertical={true}
            options={[
              {
                name: "I have a business/employment opportunity",
                value: "business",
              },
              {
                name: "I would like your help on an upcoming open source project",
                value: "project",
              },
              { name: "I have a question to ask", value: "question" },
              {
                name: "I'm interested in learning more about Pat Sullivan",
                value: "interest",
              },
              { name: "Other", value: "other" },
            ]}
          />
        </div>
      </div>
      <div className="flex flex-row-reverse">
        <Button
          type={ButtonTypes.SUBMIT}
          variant={ButtonVariants.SECONDARY}
          rounding={ButtonCornerRoundingTypes.FULL}
          hoverText="Continue">
          Continue
        </Button>
      </div>
    </div>
  );
}
