/**
 * Utility functions for tenant management
 * Extracts tenant ID from URL (query parameter or path) or falls back to environment variable
 */

/**
 * Gets the tenant ID from various sources in priority order:
 * 1. URL query parameter: ?tenantId=ethiopia.citya
 * 2. URL path: /tenant/ethiopia.citya/...
 * 3. Environment variable: REACT_APP_TENANT_ID
 * 4. Default fallback: ethiopia.citya
 * 
 * @returns {string} The tenant ID
 */
export const getTenantId = () => {
  // 1. Check URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const queryTenantId = urlParams.get('tenantId');
  if (queryTenantId) {
    return queryTenantId;
  }

  // 2. Check URL path (e.g., /tenant/ethiopia.citya/...)
  const pathMatch = window.location.pathname.match(/\/tenant\/([^\/]+)/);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }

  // 3. Check environment variable (only if it's not empty)
  const envTenantId = process.env.REACT_APP_TENANT_ID;
  if (envTenantId && envTenantId.trim() !== '') {
    return envTenantId;
  }

  // 4. Default fallback
  return 'ethiopia.citya';
};

/**
 * Updates the URL with a new tenant ID without reloading the page
 * @param {string} tenantId - The tenant ID to set
 */
export const setTenantIdInUrl = (tenantId) => {
  const url = new URL(window.location);
  url.searchParams.set('tenantId', tenantId);
  window.history.pushState({}, '', url);
};
