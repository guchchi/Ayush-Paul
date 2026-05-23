export const ADMIN_UIDS = ["80OJfcmVXCRNmSZuthVU68K6vJq2"];

export const ADMIN_EMAILS = [
  "ap877@cornell.edu", // Add Cornell address or similar if desired
];

export const isUserAdmin = (uid: string | undefined): boolean => {
  if (!uid) return false;
  return ADMIN_UIDS.includes(uid);
};
