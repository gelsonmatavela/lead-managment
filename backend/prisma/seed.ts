import { PrismaClient, AuthPermissionAction } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data (optional - uncomment if needed)
  // await prisma.userRole.deleteMany({});
  // await prisma.authPermission.deleteMany({});
  // await prisma.authRole.deleteMany({});
  // await prisma.staff.deleteMany({});
  // await prisma.user.deleteMany({});
  // await prisma.company.deleteMany({});
  // await prisma.address.deleteMany({});

  // 1. Create base addresses
  console.log('Creating addresses...');
  const addresses = await Promise.all([
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

  // 3. Create companies
  console.log('Creating companies...');
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'TechMoz Solutions',
        email: 'contact@techmoz.mz',
        phone1: '+258 21 123456',
        phone2: '+258 84 123456',
        logo: 'https://via.placeholder.com/200x200/0066cc/ffffff?text=TechMoz',
        addressId: addresses[0].id
      }
    }),
    prisma.company.create({
      data: {
        name: 'Beira Digital',
        email: 'info@beiradigital.mz',
        phone1: '+258 23 456789',
        phone2: '+258 85 456789',
        logo: 'https://via.placeholder.com/200x200/cc6600/ffffff?text=BeiraDigital',
        addressId: addresses[1].id
      }
    }),
    prisma.company.create({
      data: {
        name: 'Nampula Innovations',
        email: 'contact@nampulainnovations.mz',
        phone1: '+258 26 789012',
        phone2: '+258 86 789012',
        logo: 'https://via.placeholder.com/200x200/009933/ffffff?text=NampulaInnovations',
        addressId: addresses[2].id
      }
    }),
    prisma.company.create({
      data: {
        name: 'Gaza Tech',
        email: 'hello@gazatech.mz',
        phone1: '+258 28 345678',
        phone2: '+258 87 345678',
        logo: 'https://via.placeholder.com/200x200/cc0066/ffffff?text=GazaTech',
        addressId: addresses[3].id
      }
    }),
    prisma.company.create({
      data: {
        name: 'Inhambane Systems',
        email: 'admin@inhambanesystems.mz',
        phone1: '+258 29 901234',
        phone2: '+258 88 901234',
        logo: 'https://via.placeholder.com/200x200/6600cc/ffffff?text=InhambaneSystems',
        addressId: addresses[4].id
      }
    })
  ]);

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

  // 5. Create leader users (30)
  console.log('Creating 30 leader users...');
  const leaderUsers = [];
  
  for (let i = 1; i <= 30; i++) {
    const companyIndex = (i - 1) % companies.length;
    const company = companies[companyIndex];
    
    // Create address for leader
    const leaderAddress = await prisma.address.create({
      data: {
        country: 'Mozambique',
        state: ['Maputo', 'Sofala', 'Nampula', 'Gaza', 'Inhambane'][Math.floor(Math.random() * 5)],
        city: ['Maputo', 'Beira', 'Nampula', 'Xai-Xai', 'Inhambane'][Math.floor(Math.random() * 5)],
        neighborhood: `District ${i}`,
        street: `Leader Street ${i}, no ${i * 10}`
      }
    });

    const leaderPassword = await bcrypt.hash(`Leader${i}Pass123!`, 10);
    
    const leader = await prisma.user.create({
      data: {
        name: `Leader ${i.toString().padStart(2, '0')}`,
        email: `leader${i}@${company.email.split('@')[1]}`,
        picture: `https://via.placeholder.com/150x150/0066cc/ffffff?text=L${i}`,
        password: leaderPassword,
        isSuperUser: false,
        isStaff: true,
        isActive: true,
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

    // Create staff for leader
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

    leaderUsers.push(leader);
  }

  console.log(`${leaderUsers.length} leaders created`);

  // 6. Create non-leader users (40)
  console.log('Creating 40 non-leader users...');
  const staffUsers = [];
  
  for (let i = 1; i <= 40; i++) {
    const companyIndex = (i - 1) % companies.length;
    const company = companies[companyIndex];
    
    // Create address for staff member
    const staffAddress = await prisma.address.create({
      data: {
        country: 'Mozambique',
        state: ['Maputo', 'Sofala', 'Nampula', 'Gaza', 'Inhambane'][Math.floor(Math.random() * 5)],
        city: ['Maputo', 'Beira', 'Nampula', 'Xai-Xai', 'Inhambane'][Math.floor(Math.random() * 5)],
        neighborhood: `Staff District ${i}`,
        street: `Staff Street ${i}, no ${i * 5}`
      }
    });

    const staffPassword = await bcrypt.hash(`Staff${i}Pass123!`, 10);
    
    const staffUser = await prisma.user.create({
      data: {
        name: `Staff Member ${i.toString().padStart(2, '0')}`,
        email: `staff${i}@${company.email.split('@')[1]}`,
        picture: `https://via.placeholder.com/150x150/009933/ffffff?text=S${i}`,
        password: staffPassword,
        isSuperUser: false,
        isStaff: true,
        isActive: true,
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
  console.log(`Leaders: 30`);
  console.log(`Staff Members: 40`);
  console.log(`Companies: ${companies.length}`);
  console.log(`Roles: 3 (SuperAdmin, Leader, Staff)`);
  console.log(`Addresses: ${addresses.length + 1 + 30 + 40}`);

  console.log('\nACCESS CREDENTIALS:');
  console.log('========================');
  console.log(`SuperUser:`);
  console.log(`  Email: superadmin@system.mz`);
  console.log(`  Password: SuperUser123!`);
  console.log(`  (No company code required)`);
  
  console.log(`\nLeaders (examples):`);
  for (let i = 1; i <= 3; i++) {
    const companyIndex = (i - 1) % companies.length;
    const company = companies[companyIndex];
    const companyCode = `COMP${(companyIndex + 1).toString().padStart(3, '0')}`;
    console.log(`  Email: leader${i}@${company.email.split('@')[1]}`);
    console.log(`  CompanyCode: ${companyCode}`);
    console.log(`  Password: Leader${i}Pass123!`);
  }

  console.log(`\nStaff Members (examples):`);
  for (let i = 1; i <= 3; i++) {
    const companyIndex = (i - 1) % companies.length;
    const company = companies[companyIndex];
    const companyCode = `COMP${(companyIndex + 1).toString().padStart(3, '0')}`;
    console.log(`  Email: staff${i}@${company.email.split('@')[1]}`);
    console.log(`  CompanyCode: ${companyCode}`);
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