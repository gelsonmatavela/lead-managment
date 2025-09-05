import { PrismaClient, AuthPermissionAction } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data - UNCOMMENTED to avoid conflicts
  console.log('Clearing existing data...');
  await prisma.userRole.deleteMany({});
  await prisma.authPermission.deleteMany({});
  await prisma.authRole.deleteMany({});
  await prisma.staff.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.address.deleteMany({});
  console.log('Existing data cleared.');

  // 1. Create base addresses for companies
  console.log('Creating company addresses...');
  const companyAddresses = await Promise.all([
    // Original 5 companies
    prisma.address.create({
      data: {
        country: 'Mozambique',
        state: 'Maputo',
        city: 'Maputo',
        neighborhood: 'Baixa',
        street: 'Av. Julius Nyerere, 123'
      }
    }),
    prisma.address.create({
      data: {
        country: 'Mozambique',
        state: 'Sofala',
        city: 'Beira',
        neighborhood: 'Centro',
        street: 'Rua do Aeroporto, 456'
      }
    }),
    prisma.address.create({
      data: {
        country: 'Mozambique',
        state: 'Nampula',
        city: 'Nampula',
        neighborhood: 'Muhala',
        street: 'Av. Eduardo Mondlane, 789'
      }
    }),
    prisma.address.create({
      data: {
        country: 'Mozambique',
        state: 'Gaza',
        city: 'Xai-Xai',
        neighborhood: 'Centro',
        street: 'Av. da Independencia, 321'
      }
    }),
    prisma.address.create({
      data: {
        country: 'Mozambique',
        state: 'Inhambane',
        city: 'Inhambane',
        neighborhood: 'Liberdade',
        street: 'Rua dos Combatentes, 654'
      }
    }),
    // Additional 5 companies
    prisma.address.create({
      data: {
        country: 'Mozambique',
        state: 'Tete',
        city: 'Tete',
        neighborhood: 'Matundo',
        street: 'Av. 25 de Setembro, 987'
      }
    }),
    prisma.address.create({
      data: {
        country: 'Mozambique',
        state: 'Manica',
        city: 'Chimoio',
        neighborhood: '1º de Maio',
        street: 'Rua da Liberdade, 147'
      }
    }),
    prisma.address.create({
      data: {
        country: 'Mozambique',
        state: 'Zambézia',
        city: 'Quelimane',
        neighborhood: 'Chuabo Dembe',
        street: 'Av. Samora Machel, 258'
      }
    }),
    prisma.address.create({
      data: {
        country: 'Mozambique',
        state: 'Cabo Delgado',
        city: 'Pemba',
        neighborhood: 'Paquitequete',
        street: 'Rua dos Pescadores, 369'
      }
    }),
    prisma.address.create({
      data: {
        country: 'Mozambique',
        state: 'Niassa',
        city: 'Lichinga',
        neighborhood: 'Namacula',
        street: 'Av. da Unidade, 741'
      }
    })
  ]);

  // 2. Create roles and permissions
  console.log('Creating roles and permissions...');
  
  // Role SuperAdmin
  const superAdminRole = await prisma.authRole.create({
    data: {
      name: 'SuperAdmin',
      description: 'Full system access',
      permissions: {
        create: [
          { resource: 'users', action: AuthPermissionAction.View },
          { resource: 'users', action: AuthPermissionAction.Create },
          { resource: 'users', action: AuthPermissionAction.Update },
          { resource: 'users', action: AuthPermissionAction.Delete },
          { resource: 'companies', action: AuthPermissionAction.View },
          { resource: 'companies', action: AuthPermissionAction.Create },
          { resource: 'companies', action: AuthPermissionAction.Update },
          { resource: 'companies', action: AuthPermissionAction.Delete },
          { resource: 'roles', action: AuthPermissionAction.View },
          { resource: 'roles', action: AuthPermissionAction.Create },
          { resource: 'roles', action: AuthPermissionAction.Update },
          { resource: 'roles', action: AuthPermissionAction.Delete },
          { resource: 'system', action: AuthPermissionAction.View },
          { resource: 'system', action: AuthPermissionAction.Create },
          { resource: 'system', action: AuthPermissionAction.Update },
          { resource: 'system', action: AuthPermissionAction.Delete }
        ]
      }
    }
  });

  // Role Leader
  const leaderRole = await prisma.authRole.create({
    data: {
      name: 'Leader',
      description: 'Company leader with administrative permissions',
      permissions: {
        create: [
          { resource: 'users', action: AuthPermissionAction.View },
          { resource: 'users', action: AuthPermissionAction.Create },
          { resource: 'users', action: AuthPermissionAction.Update },
          { resource: 'company', action: AuthPermissionAction.View },
          { resource: 'company', action: AuthPermissionAction.Update },
          { resource: 'staff', action: AuthPermissionAction.View },
          { resource: 'staff', action: AuthPermissionAction.Create },
          { resource: 'staff', action: AuthPermissionAction.Update },
          { resource: 'reports', action: AuthPermissionAction.View }
        ]
      }
    }
  });

  // Role Staff
  const staffRole = await prisma.authRole.create({
    data: {
      name: 'Staff',
      description: 'Employee with limited permissions',
      permissions: {
        create: [
          { resource: 'profile', action: AuthPermissionAction.View },
          { resource: 'profile', action: AuthPermissionAction.Update },
          { resource: 'company', action: AuthPermissionAction.View },
          { resource: 'reports', action: AuthPermissionAction.View }
        ]
      }
    }
  });

  // 3. Create 10 companies
  console.log('Creating 10 companies...');
  const companyData = [
    {
      name: 'TechMoz Solutions',
      email: 'contact@techmoz.mz',
      phone1: '+258 21 123456',
      phone2: '+258 84 123456',
      logo: 'https://via.placeholder.com/200x200/0066cc/ffffff?text=TechMoz'
    },
    {
      name: 'Beira Digital',
      email: 'info@beiradigital.mz',
      phone1: '+258 23 456789',
      phone2: '+258 85 456789',
      logo: 'https://via.placeholder.com/200x200/cc6600/ffffff?text=BeiraDigital'
    },
    {
      name: 'Nampula Innovations',
      email: 'contact@nampulainnovations.mz',
      phone1: '+258 26 789012',
      phone2: '+258 86 789012',
      logo: 'https://via.placeholder.com/200x200/009933/ffffff?text=NampulaInnovations'
    },
    {
      name: 'Gaza Tech',
      email: 'hello@gazatech.mz',
      phone1: '+258 28 345678',
      phone2: '+258 87 345678',
      logo: 'https://via.placeholder.com/200x200/cc0066/ffffff?text=GazaTech'
    },
    {
      name: 'Inhambane Systems',
      email: 'admin@inhambanesystems.mz',
      phone1: '+258 29 901234',
      phone2: '+258 88 901234',
      logo: 'https://via.placeholder.com/200x200/6600cc/ffffff?text=InhambaneSystems'
    },
    {
      name: 'Tete Mining Tech',
      email: 'operations@tetemining.mz',
      phone1: '+258 25 234567',
      phone2: '+258 89 234567',
      logo: 'https://via.placeholder.com/200x200/cc3300/ffffff?text=TeteMining'
    },
    {
      name: 'Chimoio Software',
      email: 'dev@chimoiosoftware.mz',
      phone1: '+258 25 567890',
      phone2: '+258 82 567890',
      logo: 'https://via.placeholder.com/200x200/3366cc/ffffff?text=ChimoioSoft'
    },
    {
      name: 'Quelimane Analytics',
      email: 'insights@quelimaneanalytics.mz',
      phone1: '+258 24 890123',
      phone2: '+258 83 890123',
      logo: 'https://via.placeholder.com/200x200/009966/ffffff?text=QuelimaneAnalytics'
    },
    {
      name: 'Pemba Logistics',
      email: 'logistics@pembalogistics.mz',
      phone1: '+258 27 012345',
      phone2: '+258 81 012345',
      logo: 'https://via.placeholder.com/200x200/cc9900/ffffff?text=PembaLogistics'
    },
    {
      name: 'Lichinga Digital',
      email: 'contact@lichingadigital.mz',
      phone1: '+258 27 345678',
      phone2: '+258 80 345678',
      logo: 'https://via.placeholder.com/200x200/9933cc/ffffff?text=LichingaDigital'
    }
  ];

  const companies = [];
  for (let i = 0; i < companyData.length; i++) {
    const company = await prisma.company.create({
      data: {
        ...companyData[i],
        addressId: companyAddresses[i].id
      }
    });
    companies.push(company);
  }

  // 4. Create SuperUser
  console.log('Creating SuperUser...');
  const superUserAddress = await prisma.address.create({
    data: {
      country: 'Mozambique',
      state: 'Maputo',
      city: 'Maputo',
      neighborhood: 'Polana',
      street: 'Av. Marginal, 1'
    }
  });

  const hashedSuperPassword = await bcrypt.hash('SuperUser123!', 10);
  
  const superUser = await prisma.user.create({
    data: {
      name: 'Super Administrator',
      email: 'superadmin@system.mz',
      picture: 'https://via.placeholder.com/150x150/000000/ffffff?text=SA',
      password: hashedSuperPassword,
      isSuperUser: true,
      isStaff: false,
      isActive: true,
      addressId: superUserAddress.id
    }
  });

  // Assign SuperAdmin role to SuperUser
  await prisma.userRole.create({
    data: {
      userId: superUser.id,
      roleId: superAdminRole.id
    }
  });

  console.log(`SuperUser created: ${superUser.email}`);

  // 5. Define leaders per company (total deve ser menos de 300 para deixar espaço para staff)
  const leadersPerCompany = [25, 20, 30, 18, 24, 19, 28, 22, 20, 25]; // Total: 231 leaders
  
  console.log('Creating leaders for each company...');
  const allLeaders = [];
  let leaderCounter = 1;

  for (let companyIndex = 0; companyIndex < companies.length; companyIndex++) {
    const company = companies[companyIndex];
    const numLeaders = leadersPerCompany[companyIndex];
    
    console.log(`Creating ${numLeaders} leaders for ${company.name}...`);

    for (let i = 0; i < numLeaders; i++) {
      // Create address for leader
      const leaderAddress = await prisma.address.create({
        data: {
          country: 'Mozambique',
          state: ['Maputo', 'Sofala', 'Nampula', 'Gaza', 'Inhambane', 'Tete', 'Manica', 'Zambézia', 'Cabo Delgado', 'Niassa'][Math.floor(Math.random() * 10)],
          city: ['Maputo', 'Beira', 'Nampula', 'Xai-Xai', 'Inhambane', 'Tete', 'Chimoio', 'Quelimane', 'Pemba', 'Lichinga'][Math.floor(Math.random() * 10)],
          neighborhood: `Leader District ${leaderCounter}`,
          street: `Leader Street ${leaderCounter}, no ${leaderCounter * 10}`
        }
      });

      const leaderPassword = await bcrypt.hash(`Leader${leaderCounter}Pass123!`, 10);
      
      const leader = await prisma.user.create({
        data: {
          name: `Leader ${leaderCounter.toString().padStart(3, '0')}`,
          email: `leader${leaderCounter}@${company.email.split('@')[1]}`,
          picture: `https://via.placeholder.com/150x150/0066cc/ffffff?text=L${leaderCounter}`,
          password: leaderPassword,
          isSuperUser: false,
          isStaff: true,
          isActive: Math.random() > 0.05, // 95% active
          addressId: leaderAddress.id
        }
      });

      // Assign Leader role
      await prisma.userRole.create({
        data: {
          userId: leader.id,
          roleId: leaderRole.id
        }
      });

      // Create staff record for leader
      const companyCode = `COMP${(companyIndex + 1).toString().padStart(3, '0')}`;
      
      const staffRecord = await prisma.staff.create({
        data: {
          userId: leader.id,
          companyCode,
          companyId: company.id
        }
      });

      // Update company to include this leader
      await prisma.company.update({
        where: { id: company.id },
        data: {
          leaders: {
            connect: { id: staffRecord.id }
          }
        }
      });

      allLeaders.push(leader);
      leaderCounter++;
    }
  }

  console.log(`${allLeaders.length} leaders created across all companies`);

  // 6. Create regular staff members to reach 300 total users
  const targetTotalUsers = 300;
  const currentUsers = 1 + allLeaders.length; // SuperUser + Leaders
  const remainingUsers = targetTotalUsers - currentUsers;
  
  console.log(`Creating ${remainingUsers} regular staff members...`);
  const staffUsers = [];
  
  for (let i = 1; i <= remainingUsers; i++) {
    const companyIndex = (i - 1) % companies.length;
    const company = companies[companyIndex];
    
    // Create address for staff member
    const staffAddress = await prisma.address.create({
      data: {
        country: 'Mozambique',
        state: ['Maputo', 'Sofala', 'Nampula', 'Gaza', 'Inhambane', 'Tete', 'Manica', 'Zambézia', 'Cabo Delgado', 'Niassa'][Math.floor(Math.random() * 10)],
        city: ['Maputo', 'Beira', 'Nampula', 'Xai-Xai', 'Inhambane', 'Tete', 'Chimoio', 'Quelimane', 'Pemba', 'Lichinga'][Math.floor(Math.random() * 10)],
        neighborhood: `Staff District ${i}`,
        street: `Staff Street ${i}, no ${i * 5}`
      }
    });

    const staffPassword = await bcrypt.hash(`Staff${i}Pass123!`, 10);
    
    const staffUser = await prisma.user.create({
      data: {
        name: `Staff Member ${i.toString().padStart(3, '0')}`,
        email: `staff${i}@${company.email.split('@')[1]}`,
        picture: `https://via.placeholder.com/150x150/009933/ffffff?text=S${i}`,
        password: staffPassword,
        isSuperUser: false,
        isStaff: true,
        isActive: Math.random() > 0.1, // 90% active
        addressId: staffAddress.id
      }
    });

    // Assign Staff role
    await prisma.userRole.create({
      data: {
        userId: staffUser.id,
        roleId: staffRole.id
      }
    });

    // Create staff record
    const companyCode = `COMP${(companyIndex + 1).toString().padStart(3, '0')}`;
    
    await prisma.staff.create({
      data: {
        userId: staffUser.id,
        companyCode,
        companyId: company.id
      }
    });

    staffUsers.push(staffUser);
  }

  console.log(`${staffUsers.length} staff members created`);

  // 7. Final summary
  console.log('\nSEED SUMMARY:');
  console.log('===================');
  console.log(`SuperUsers: 1`);
  console.log(`Leaders: ${allLeaders.length}`);
  console.log(`Staff Members: ${staffUsers.length}`);
  console.log(`Total Users: ${1 + allLeaders.length + staffUsers.length}`);
  console.log(`Companies: ${companies.length}`);
  console.log(`Roles: 3 (SuperAdmin, Leader, Staff)`);

  console.log(`\nLeaders per company:`);
  for (let i = 0; i < companies.length; i++) {
    console.log(`  ${companies[i].name}: ${leadersPerCompany[i]} leaders`);
  }

  console.log(`\nSuperUser:`);
  console.log(`  Email: superadmin@system.mz`);
  console.log(`  Password: SuperUser123!`);
  
  console.log(`\nLeaders (examples):`);
  for (let i = 1; i <= 5; i++) {
    const companyIndex = (i - 1) % companies.length;
    const company = companies[companyIndex];
    console.log(`  Email: leader${i}@${company.email.split('@')[1]}`);
    console.log(`  Password: Leader${i}Pass123!`);
  }

  console.log(`\nStaff Members (examples):`);
  for (let i = 1; i <= 5; i++) {
    const companyIndex = (i - 1) % companies.length;
    const company = companies[companyIndex];
    console.log(`  Email: staff${i}@${company.email.split('@')[1]}`);
    console.log(`  Password: Staff${i}Pass123!`);
  }

  console.log(`\nCompany Codes:`);
  companies.forEach((company, index) => {
    const companyCode = `COMP${(index + 1).toString().padStart(3, '0')}`;
    console.log(`  ${company.name}: ${companyCode}`);
  });

  console.log('\nSeed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });