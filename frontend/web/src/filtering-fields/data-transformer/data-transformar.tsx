
export const dataTransformers = {
  countryTransformer: (value: string) => ({
    display: `${value}`,
    searchable: value.toLowerCase(),
  }),

  stateTransformer: (value: string) => ({
    display: `${value}`,
    searchable: value.toLowerCase(),
  }),

  cityTransformer: (value: string) => ({
    display: `${value}`,
    searchable: value.toLowerCase(),
  }),

  neighborhoodTransformer: (value: string) => ({
    display: `${value}`,
    searchable: value.toLowerCase(),
  }),

  companyTransformer: (company: any) => ({
    display: (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
          {company.name?.charAt(0).toUpperCase() || 'C'}
        </div>
        <span className="font-medium">{company.name}</span>
        {company.industry && (
          <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
            {company.industry}
          </span>
        )}
      </div>
    ),
    searchable: `${company.name} ${company.industry || ''}`.toLowerCase(),
    value: company.id,
  }),

  userTransformer: (user: any) => ({
    display: (
      <div className="flex items-center gap-3 py-1">
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          {user.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          )}
        </div>
        
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 truncate">
              {user.name || 'Usuário sem nome'}
            </span>
            {user.role && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user.role}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 truncate">
            {user.email}
          </div>
        </div>
    ),
    searchable: `${user.name || ''} ${user.email} ${user.role || ''}`.toLowerCase(),
    value: user.id,
  }),
};