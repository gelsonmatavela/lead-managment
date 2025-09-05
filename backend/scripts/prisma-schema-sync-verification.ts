import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ColumnInfo {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
}

interface ForeignKeyInfo {
  constraint_name: string
  table_name: string
  column_name: string
  foreign_table_name: string
  foreign_column_name: string
}

async function checkSchemaSync() {
  console.log('🔍 VERIFICANDO SINCRONIZAÇÃO SCHEMA-BANCO')
  console.log('==========================================\n')

  try {
    // 1. Verificar se a coluna quotationId existe na tabela RequestItem
    const requestItemColumns = await prisma.$queryRaw<ColumnInfo[]>`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'RequestItem'
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `

    console.log('📋 Colunas atuais na tabela RequestItem:')
    requestItemColumns.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(not null)'
      console.log(`   - ${col.column_name}: ${col.data_type} ${nullable}`)
    })

    const hasQuotationId = requestItemColumns.some(col => col.column_name === 'quotationId')
    
    console.log(`\n🔍 Campo quotationId existe: ${hasQuotationId ? '✅ SIM' : '❌ NÃO'}`)

    if (!hasQuotationId) {
      console.log('\n❌ PROBLEMA IDENTIFICADO: SCHEMA DESATUALIZADO')
      console.log('===============================================')
      console.log('O campo quotationId não existe no banco, mas está definido no schema Prisma.')
      console.log('Isso indica que o banco não está sincronizado com o schema.')
      console.log()
      console.log('💡 SOLUÇÕES POSSÍVEIS:')
      console.log()
      console.log('1️⃣ SINCRONIZAR SCHEMA COM BANCO (Recomendado para dev):')
      console.log('   npx prisma db push')
      console.log('   (Força o banco a ficar igual ao schema)')
      console.log()
      console.log('2️⃣ APLICAR MIGRATIONS PENDENTES:')
      console.log('   npx prisma migrate dev')
      console.log('   (Aplica migrations em ordem)')
      console.log()
      console.log('3️⃣ RESETAR BANCO (CUIDADO - PERDE DADOS!):')
      console.log('   npx prisma migrate reset')
      console.log('   (Recria o banco do zero)')
      console.log()
      console.log('4️⃣ ATUALIZAR SCHEMA A PARTIR DO BANCO:')
      console.log('   npx prisma db pull')
      console.log('   (Atualiza o schema para refletir o banco atual)')

      return false
    }

    // 2. Se quotationId existe, verificar foreign keys
    console.log('\n🔍 Verificando foreign keys...')
    
    const foreignKeys = await prisma.$queryRaw<ForeignKeyInfo[]>`
      SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'RequestItem'
        AND kcu.column_name = 'quotationId'
    `

    if (foreignKeys.length === 0) {
      console.log('⚠️  Foreign key RequestItem.quotationId -> Quotation.id NÃO EXISTE')
      console.log('Isso pode estar causando problemas na migration.')
      console.log()
      console.log('💡 SOLUÇÕES:')
      console.log('1. Execute: npx prisma db push')
      console.log('2. Ou adicione a foreign key manualmente:')
      console.log('   ALTER TABLE "RequestItem" ADD CONSTRAINT "RequestItem_quotationId_fkey"')
      console.log('   FOREIGN KEY ("quotationId") REFERENCES "Quotation"(id);')
    } else {
      console.log('✅ Foreign key existe:')
      foreignKeys.forEach(fk => {
        console.log(`   ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`)
      })
    }

    // 3. Verificar dados órfãos se a estrutura estiver OK
    await checkOrphanedData()

    return true

  } catch (error) {
    console.error('❌ Erro durante verificação:', error)
    return false
  }
}

async function checkOrphanedData() {
  console.log('\n🔍 VERIFICANDO DADOS ÓRFÃOS')
  console.log('============================\n')

  try {
    // Contar RequestItems com quotationId
    const requestItemsWithQuotation = await prisma.requestItem.count({
      where: { quotationId: { not: null } }
    })

    console.log(`📊 RequestItems com quotationId: ${requestItemsWithQuotation}`)

    if (requestItemsWithQuotation === 0) {
      console.log('✅ Nenhum RequestItem tem quotationId - sem riscos de integridade')
      return
    }

    // Verificar dados órfãos
    const orphanedCount = await prisma.$queryRaw<Array<{count: bigint}>>`
      SELECT COUNT(*) as count
      FROM "RequestItem" ri
      LEFT JOIN "Quotation" q ON ri."quotationId" = q.id
      WHERE ri."quotationId" IS NOT NULL AND q.id IS NULL
    `

    const orphanedNum = Number(orphanedCount[0]?.count || 0)

    if (orphanedNum > 0) {
      console.log(`❌ ${orphanedNum} RequestItems órfãos encontrados`)
      console.log('Estes registros impedem a criação da foreign key.')
      console.log()
      console.log('💡 Para corrigir, execute:')
      console.log('FIX_STRATEGY=null npx ts-node schema-sync.ts --fix-orphans')
    } else {
      console.log('✅ Nenhum dado órfão encontrado')
    }

  } catch (error) {
    console.log('⚠️  Não foi possível verificar dados órfãos (coluna pode não existir)')
    console.log('Execute primeiro: npx prisma db push')
  }
}

async function fixOrphanedData() {
  console.log('🔧 CORRIGINDO DADOS ÓRFÃOS')
  console.log('===========================\n')

  const strategy = process.env.FIX_STRATEGY || 'null'

  try {
    let result

    switch (strategy) {
      case 'null':
        console.log('Definindo quotationId como NULL para registros órfãos...')
        result = await prisma.$executeRaw`
          UPDATE "RequestItem" 
          SET "quotationId" = NULL 
          WHERE "quotationId" IS NOT NULL 
          AND "quotationId" NOT IN (SELECT id FROM "Quotation")
        `
        console.log(`✅ ${result} RequestItems corrigidos`)
        break

      case 'delete':
        console.log('⚠️  REMOVENDO RequestItems órfãos...')
        result = await prisma.$executeRaw`
          DELETE FROM "RequestItem" 
          WHERE "quotationId" IS NOT NULL 
          AND "quotationId" NOT IN (SELECT id FROM "Quotation")
        `
        console.log(`⚠️  ${result} RequestItems removidos`)
        break

      default:
        console.log('❌ Use FIX_STRATEGY=null ou FIX_STRATEGY=delete')
        return
    }

    console.log('\n✅ Correção concluída!')
    console.log('Agora você pode executar: npx prisma migrate dev')

  } catch (error) {
    console.error('❌ Erro durante correção:', error)
  }
}

async function showMigrationStatus() {
  console.log('📋 STATUS DAS MIGRATIONS')
  console.log('=========================\n')

  try {
    // Verificar se tabela _prisma_migrations existe
    const migrationTable = await prisma.$queryRaw<Array<{exists: boolean}>>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '_prisma_migrations'
      );
    `

    if (!migrationTable[0]?.exists) {
      console.log('❌ Tabela _prisma_migrations não existe')
      console.log('Execute: npx prisma migrate dev --name init')
      return
    }

    // Listar migrations aplicadas
    const migrations = await prisma.$queryRaw<Array<{
      id: string
      checksum: string
      finished_at: Date | null
      migration_name: string
      logs: string | null
      rolled_back_at: Date | null
      started_at: Date
      applied_steps_count: number
    }>>`
      SELECT * FROM "_prisma_migrations" 
      ORDER BY started_at DESC
      LIMIT 10
    `

    console.log('📊 Últimas migrations aplicadas:')
    migrations.forEach(migration => {
      const status = migration.finished_at ? '✅' : '❌'
      console.log(`${status} ${migration.migration_name} (${migration.started_at})`)
    })

  } catch (error) {
    console.log('⚠️  Não foi possível verificar status das migrations:', error.message)
  }
}

async function main() {
  const args = process.argv.slice(2)

  console.log('🔍 VERIFICADOR DE SINCRONIZAÇÃO PRISMA')
  console.log('======================================\n')

  if (args.includes('--fix-orphans')) {
    await fixOrphanedData()
    await prisma.$disconnect()
    return
  }

  if (args.includes('--migration-status')) {
    await showMigrationStatus()
    await prisma.$disconnect()
    return
  }

  // Análise completa
  const isStructureOK = await checkSchemaSync()
  
  if (isStructureOK) {
    console.log('\n✅ ESTRUTURA DO BANCO ESTÁ SINCRONIZADA')
    console.log('======================================')
    console.log('O banco está alinhado com o schema Prisma.')
    console.log('Se ainda há erro na migration, pode ser problema de dados órfãos.')
  }

  await showMigrationStatus()

  console.log('\n📖 COMANDOS DISPONÍVEIS:')
  console.log('========================')
  console.log('npx ts-node schema-sync.ts --migration-status           # Ver status das migrations')
  console.log('FIX_STRATEGY=null npx ts-node schema-sync.ts --fix-orphans  # Corrigir dados órfãos')
  console.log()
  console.log('🔧 COMANDOS PRISMA ÚTEIS:')
  console.log('npx prisma db push              # Sincronizar schema com banco')
  console.log('npx prisma migrate dev          # Aplicar migrations')
  console.log('npx prisma db pull             # Atualizar schema a partir do banco')
  console.log('npx prisma migrate status      # Ver status das migrations')

  await prisma.$disconnect()
}

main().catch(console.error)