export const formatPhoneNumber = (phoneNumber?: string): string | null => {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    const intlCode = match[1] ? "+1 " : "";

    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }

  return null;
};
