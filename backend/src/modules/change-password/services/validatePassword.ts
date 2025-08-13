export const validatePassword = (pw: string) => {
  return {
    length: pw.length >= 10 && pw.length <= 14,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /\d/.test(pw),
    noSpecial: /^[A-Za-z0-9]*$/.test(pw),
    noLeadingDigit: !/^\d/.test(pw),
  };
};
