import { sendErrorForbidden } from './errorUtils'

// Simplified version focusing on roles instead of parties
const getPermittedBusinessUnits = (req) => {
  // Instead of extracting from parties_accesses, 
  // extract from user roles or permissions
  const userRoles = req.auth.user.roles || []
  
  // Example: Map roles to allowed business units
  const businessUnitsByRole = {
    'admin': ['all'], // Admin can access everything
    'manager': ['specific-business-unit-uuid'], // Managers might have limited access
    'viewer': ['read-only-business-unit-uuid']
  }

  // Collect business units based on user's roles
  const allowedBusinessUnits = userRoles
    .flatMap(role => businessUnitsByRole[role] || [])
    .filter(bu => bu !== 'all')

  return allowedBusinessUnits.length ? allowedBusinessUnits.join(',') : null
}

const getPermittedCustomers = (req) => {
  // Similar approach for customers
  const userRoles = req.auth.user.roles || []
  
  const customersByRole = {
    'admin': ['all'],
    'manager': ['specific-customer-uuid'],
    'viewer': ['read-only-customer-uuid']
  }

  const allowedCustomers = userRoles
    .flatMap(role => customersByRole[role] || [])
    .filter(customer => customer !== 'all')

  return allowedCustomers.length 
    ? { mandatory: allowedCustomers[0] } 
    : null
}

const prepareRequest = (req, type, customerResult, businessUnitResult) => {
  return {
    ...req[type],
    ...(customerResult ? { customerUuid: customerResult.mandatory } : {}),
    ...(businessUnitResult ? { businessUnitUuid: businessUnitResult } : {})
  }
}

const tokenPermissionsContentFilter = (req, res, next, config) => {
  try {
    const businessUnitUuid = getPermittedBusinessUnits(req)
    const customerUuidResult = getPermittedCustomers(req)

    req.body = prepareRequest(req, 'body', customerUuidResult, businessUnitUuid)
    req.query = prepareRequest(req, 'query', customerUuidResult, businessUnitUuid)

    return next()
  } catch {
    sendErrorForbidden({ res, config })
  }
}

export { tokenPermissionsContentFilter }