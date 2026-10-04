// Role model mapping (UI/UX Specification §3 and SRS role table).
//
// Backend storage roles follow the SRS vocabulary recorded in DEC-023
// (recruiter, candidate, interviewer, admin). The application-facing
// layer uses the UI/UX product roles: HR, Interviewer, Interviewee.
// admin is a recognized SRS role but has no product-role mapping in this
// phase (no admin UI in the UI/UX specification; UX-TBD-002 open), so it
// is not granted access to product-role endpoints.
export const PRODUCT_ROLES = ['hr', 'interviewer', 'interviewee'];

const PRODUCT_ROLE_BY_BACKEND_ROLE = {
  recruiter: 'hr',
  interviewer: 'interviewer',
  candidate: 'interviewee',
};

const BACKEND_ROLE_BY_PRODUCT_ROLE = {
  hr: 'recruiter',
  interviewer: 'interviewer',
  interviewee: 'candidate',
};

export const REGISTRABLE_PRODUCT_ROLES = PRODUCT_ROLES;

export function toProductRole(backendRole) {
  if (typeof backendRole !== 'string') return null;
  return PRODUCT_ROLE_BY_BACKEND_ROLE[backendRole.toLowerCase()] ?? null;
}

export function toBackendRole(productRole) {
  if (typeof productRole !== 'string') return null;
  return BACKEND_ROLE_BY_PRODUCT_ROLE[productRole.toLowerCase()] ?? null;
}
