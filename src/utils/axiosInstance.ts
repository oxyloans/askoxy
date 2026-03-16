/**
 * axiosInstance.ts — backwards-compatibility shim
 *
 * All existing imports of `axiosInstance` continue to work unchanged.
 * New code should import the specific module instance from axiosInstances.ts:
 *
 *   import { customerApi, adminApi, partnerApi, employeeApi } from "../utils/axiosInstances";
 */
export {
  customerApi as default,
  customerApi,
  adminApi,
  partnerApi,
  employeeApi,
  sharedApi,
  resolvePortalToken,
} from "./axiosInstances";
