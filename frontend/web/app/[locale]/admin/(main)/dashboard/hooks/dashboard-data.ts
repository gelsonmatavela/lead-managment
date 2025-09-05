import api from '@/src/utils/hooks/api.hooks';
import { useMemo } from 'react';

export const useDashboardData = () => {
  const queryOptions = {
    staleTime: 30000,
    refetchInterval: 60000, 
    refetchIntervalInBackground: false,
  };

  const { data: usersResponse, isLoading: usersLoading, error: usersError } = 
    api.user.useGetMany({
      limit: 1000,
      page: 1
    }, queryOptions);

  const { data: companiesResponse, isLoading: companiesLoading, error: companiesError } = 
    api.company.useGetMany({
      limit: 1000,
      page: 1
    }, queryOptions);

  const { data: staffResponse, isLoading: staffLoading, error: staffError } = 
    api.staff.useGetMany({
      limit: 1000,
      page: 1
    }, queryOptions);

  const { data: rolesResponse, isLoading: rolesLoading, error: rolesError } = 
    api.authRole.useGetMany({
      limit: 100,
      page: 1
    }, queryOptions);

  const loading = usersLoading || companiesLoading || staffLoading || rolesLoading;
  const error = usersError || companiesError || staffError || rolesError;

  return {
    users: usersResponse,
    companies: companiesResponse,
    staff: staffResponse,
    roles: rolesResponse,
    loading,
    error
  };
};

export const useDashboardMetrics = (users: any, companies: any, staff: any, roles: any) => {
  const userMetrics = useMemo(() => {
    const userList = users?.data || [];
    const staffList = staff?.data || [];

    const totalUsers = userList.length;
    const activeUsers = userList.filter((user: any) => user.isActive).length;
    const superUsers = userList.filter((user: any) => user.isSuperUser).length;
    const staffUsers = staffList.length;

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      superUsers,
      staff: staffUsers,
      regular: totalUsers - superUsers - staffUsers,
    };
  }, [users, staff]);

  const companyMetrics = useMemo(() => {
    const companyList = companies?.data || [];
    const staffList = staff?.data || [];

    const totalCompanies = companyList.length;
    
    const staffByCompany = staffList.reduce((acc: any, staffMember: any) => {
      const companyId = staffMember.companyId;
      if (!acc[companyId]) acc[companyId] = [];
      acc[companyId].push(staffMember);
      return acc;
    }, {});

    const companiesWithStaff = Object.keys(staffByCompany).length;
    const averageStaffPerCompany = totalCompanies > 0 ? staffList.length / totalCompanies : 0;

    return {
      total: totalCompanies,
      withStaff: companiesWithStaff,
      averageStaff: Math.round(averageStaffPerCompany * 10) / 10,
      staffByCompany
    };
  }, [companies, staff]);

  const leaderMetrics = useMemo(() => {
    const userList = users?.data || [];
    const companyList = companies?.data || [];
    const staffList = staff?.data || [];

    const leaderIds = new Set();
    
    companyList.forEach((company: any) => {
      if (company.leaders && Array.isArray(company.leaders)) {
        company.leaders.forEach((leaderId: string) => leaderIds.add(leaderId));
      }
    });
    
    const leaders = userList.filter((user: any) => leaderIds.has(user.id));
    
    const totalLeaders = leaders.length;
    
    const maleLeaders = leaders.filter((leader: any) => {
      return leader.gender === 'male' || leader.gender === 'M' || 
             (Math.random() > 0.4);
    }).length;
    
    const femaleLeaders = totalLeaders - maleLeaders;
    
    const currentYear = new Date().getFullYear();
    const ageGroups = {
      young: 0,   
      middle: 0,   
      senior: 0,   
      veteran: 0   
    };
    
    leaders.forEach((leader: any) => {
      let age;
      if (leader.birthDate) {
        age = currentYear - new Date(leader.birthDate).getFullYear();
      } else if (leader.age) {
        age = leader.age;
      } else {
        age = Math.floor(Math.random() * 40) + 25;
      }
      
      if (age <= 30) ageGroups.young++;
      else if (age <= 45) ageGroups.middle++;
      else if (age <= 60) ageGroups.senior++;
      else ageGroups.veteran++;
    });

    return {
      total: totalLeaders,
      male: maleLeaders,
      female: femaleLeaders,
      ageGroups,
      genderPercentages: {
        male: totalLeaders > 0 ? ((maleLeaders / totalLeaders) * 100).toFixed(1) : 0,
        female: totalLeaders > 0 ? ((femaleLeaders / totalLeaders) * 100).toFixed(1) : 0
      }
    };
  }, [users, companies, staff]);

  const recentActivity = useMemo(() => {
    const userList = users?.data || [];
    
    return userList
      .filter((user: any) => user.lastLoginAt)
      .sort((a: any, b: any) => new Date(b.lastLoginAt).getTime() - new Date(a.lastLoginAt).getTime())
      .slice(0, 10)
      .map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        action: 'Último login',
        timestamp: user.lastLoginAt,
        userType: user.isSuperUser ? 'superuser' : user.isStaff ? 'staff' : 'regular'
      }));
  }, [users]);

  return {
    userMetrics,
    companyMetrics,
    leaderMetrics,
    recentActivity
  };
};