import { SuccessContactForm } from "@open-system/contact-feature-form";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <SuccessContactForm
        title="I've received your message"
        note="Thank you so much for reaching out. I will respond back as soon as possible. Hopefully we can work together soon!"
      />
    </div>
  );
}
