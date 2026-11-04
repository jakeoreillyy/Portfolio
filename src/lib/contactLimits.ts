// Longest value the contact API accepts for each field. The form sets the same
// numbers as maxLength, so input stops at the limit instead of the server
// rejecting it after submit. api/contact.ts imports this too, so keep it free
// of imports and browser code.
export const MAX_LENGTH = {
  name: 200,
  email: 320,
  subject: 200,
  message: 5000,
} as const;
