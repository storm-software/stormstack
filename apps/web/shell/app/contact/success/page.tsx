import { SuccessContactForm } from "@stormstack/contact-client-components";

export default function Page() {
  return (
    <div className="gap-8 flex flex-col">
      <SuccessContactForm
        title="I've received your message"
        note="Thank you so much for reaching out. I will respond back as soon as possible. Hopefully we can work together soon!"
      />
    </div>
  );
}
