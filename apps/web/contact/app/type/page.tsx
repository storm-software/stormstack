import { ContactTypeForm } from "@open-system/contact-ui-feature-form/contact-type-form";

export default function Page() {
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-medium text-gray-300">
        Were in a remote component 2
      </h1>

      <ContactTypeForm />
    </div>
  );
}
