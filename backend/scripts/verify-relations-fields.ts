import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ColumnInfo {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
}

interface OrphanedItem {
  id: string
  quotationId?: any
  requestId?: any
  createdAt?: Date
  updatedAt?: Date
  [key: string]: any
}

async function getTableStructure(tableName: string): Promise<ColumnInfo[]> {
  try {
    const columns = await prisma.$queryRaw<ColumnInfo[]>`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = ${tableName}
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `
    return columns
  } catch (error) {
    console.error(`Erro ao buscar estrutura da tabela ${tableName}:`, error)
    return []
  }
}

async function analyzeTableStructures() {
  console.log('🔍 ANALISANDO ESTRUTURA DAS TABELAS')
  console.log('====================================\n')

  const tables = ['RequestItem', 'Quotation', 'QuotationItem', 'Request']
  
  for (const tableName of tables) {
    console.log(`📋 Tabela: ${tableName}`)
    const columns = await getTableStructure(tableName)
    
    if (columns.length === 0) {
      console.log(`   ❌ Tabela ${tableName} não encontrada ou sem colunas`)
      continue
    }

    console.log('   Colunas:')
    columns.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(not null)'
      const defaultVal = col.column_default ? ` default: ${col.column_default}` : ''
      console.log(`     - ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`)
    })
    console.log()
  }
}

async function analyzeDataIntegrity() {
  console.log('🔍 ANALISANDO INTEGRIDADE DOS DADOS')
  console.log('===================================\n')

  try {
    // 1. Verificar se as tabelas existem e têm dados
    console.log('📊 Contagem de registros:')
    
    const requestItemCount = await prisma.requestItem.count()
    console.log(`   RequestItem: ${requestItemCount} registros`)

    const quotationCount = await prisma.quotation.count()
    console.log(`   Quotation: ${quotationCount} registros`)

    const quotationItemCount = await prisma.quotationItem.count()
    console.log(`   QuotationItem: ${quotationItemCount} registros`)

    // 2. Verificar estrutura da tabela RequestItem
    const requestItemStructure = await getTableStructure('RequestItem')
    const hasQuotationId = requestItemStructure.some(col => col.column_name === 'quotationId')
    
    console.log(`\n🔍 Campo quotationId existe em RequestItem: ${hasQuotationId ? '✅ SIM' : '❌ NÃO'}`)

    if (!hasQuotationId) {
      console.log('\n⚠️  PROBLEMA IDENTIFICADO!')
      console.log('==========================')
      console.log('A coluna quotationId não existe na tabela RequestItem.')
      console.log('Isso significa que:')
      console.log('1. O schema do Prisma está diferente do banco atual')
      console.log('2. A migration ainda não foi aplicada')
      console.log('3. Ou há inconsistência entre o schema e o banco')
      console.log('\n💡 SOLUÇÕES:')
      console.log('1. Execute: npx prisma db push --accept-data-loss')
      console.log('2. Ou: npx prisma migrate dev')
      console.log('3. Ou: npx prisma db pull (para sincronizar com o banco)')
      
      await prisma.$disconnect()
      return []
    }

    // 3. Se quotationId existe, verificar integridade
    console.log('\n📋 Verificando RequestItems com quotationId...')
    
    const requestItemsWithQuotation = await prisma.requestItem.count({
      where: { quotationId: { not: null } }
    })
    console.log(`   RequestItems com quotationId: ${requestItemsWithQuotation}`)

    if (requestItemsWithQuotation === 0) {
      console.log('✅ Nenhum RequestItem tem quotationId definido - sem problemas de integridade')
      await prisma.$disconnect()
      return []
    }

    // 4. Verificar órfãos usando query raw mais segura
    console.log('\n🔍 Procurando RequestItems órfãos...')
    
    const orphanedItems = await prisma.$queryRaw<OrphanedItem[]>`
      SELECT 
        ri.id,
        ri."quotationId",
        ri."requestId", 
        ri."createdAt"
      FROM "RequestItem" ri
      LEFT JOIN "Quotation" q ON ri."quotationId" = q.id
      WHERE ri."quotationId" IS NOT NULL AND q.id IS NULL
      ORDER BY ri."createdAt" DESC
    `

    console.log(`\n${orphanedItems.length > 0 ? '❌' : '✅'} RequestItems órfãos encontrados: ${orphanedItems.length}`)

    if (orphanedItems.length > 0) {
      console.log('\n📋 Detalhes dos RequestItems órfãos:')
      orphanedItems.forEach((item, index) => {
        console.log(`${index + 1}. RequestItem ID: ${item.id}`)
        console.log(`   quotationId: ${item.quotationId}`)
        console.log(`   requestId: ${item.requestId}`)
        console.log(`   Criado em: ${item.createdAt}`)
        console.log()
      })

      // Verificar IDs únicos de quotation que não existem
      const uniqueQuotationIds = [...new Set(orphanedItems.map(item => item.quotationId))]
      console.log(`🔍 IDs de Quotation únicos não encontrados: ${uniqueQuotationIds.join(', ')}`)

      // Mostrar quotations existentes para comparação
      console.log('\n📊 Quotations existentes (últimas 10):')
      const existingQuotations = await prisma.quotation.findMany({
        select: { id: true, createdAt: true, supplierId: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      })

      existingQuotations.forEach(quotation => {
        console.log(`   ID: ${quotation.id}, Supplier: ${quotation.supplierId}, Criado: ${quotation.createdAt}`)
      })
    }

    return orphanedItems

  } catch (error) {
    console.error('❌ Erro durante análise:', error)
    return []
  }
}

async function generateSolutions(orphanedItems: OrphanedItem[]) {
  if (orphanedItems.length === 0) {
    console.log('\n✅ NENHUM PROBLEMA DE INTEGRIDADE ENCONTRADO!')
    return
  }

  console.log('\n💡 SOLUÇÕES RECOMENDADAS')
  console.log('========================\n')

  // Agrupar por quotationId
  const groupedByQuotationId = orphanedItems.reduce((acc, item) => {
    const qId = String(item.quotationId)
    if (!acc[qId]) acc[qId] = []
    acc[qId].push(item)
    return acc
  }, {} as Record<string, OrphanedItem[]>)

  Object.entries(groupedByQuotationId).forEach(([quotationId, itemsArray]) => {
    console.log(`📋 Para quotationId: ${quotationId} (${itemsArray.length} RequestItems)`)
    console.log()

    console.log('   🔧 OPÇÕES DE CORREÇÃO:')
    console.log()

    // Opção 1: Definir como NULL (mais seguro)
    console.log('   1️⃣ DEFINIR como NULL (RECOMENDADO):')
    console.log(`      UPDATE "RequestItem" SET "quotationId" = NULL WHERE "quotationId" = '${quotationId}';`)
    console.log()

    // Opção 2: Criar Quotation
    console.log('   2️⃣ CRIAR nova Quotation:')
    console.log('      Primeiro, você precisa definir dados obrigatórios:')
    console.log(`      INSERT INTO "Quotation" (`)
    console.log(`        id, "requestId", "supplierId", "quotationDate", `)
    console.log(`        "totalCost", "paymentMethod"`)
    console.log(`      ) VALUES (`)
    console.log(`        '${quotationId}', 'REQUEST_ID_AQUI', 'SUPPLIER_ID_AQUI', `)
    console.log(`        NOW(), 0.00, 'Credit'`)
    console.log(`      );`)
    console.log()

    // Opção 3: Remover RequestItems
    console.log('   3️⃣ REMOVER RequestItems (CUIDADO!):')
    console.log(`      DELETE FROM "RequestItem" WHERE "quotationId" = '${quotationId}';`)
    console.log()

    console.log('   📄 RequestItems que serão afetados:')
    itemsArray.forEach((item: OrphanedItem) => {
      console.log(`      - ${item.id} (Request: ${item.requestId})`)
    })
    console.log('\n' + '─'.repeat(70) + '\n')
  })

  console.log('💡 COMANDO PARA CORREÇÃO AUTOMÁTICA (opção mais segura):')
  console.log('======================================================')
  console.log('FIX_STRATEGY=null npx ts-node table-analyzer.ts --quick-fix')
  console.log()
}

async function executeQuickFix() {
  console.log('🔧 EXECUTANDO CORREÇÃO AUTOMÁTICA')
  console.log('==================================\n')

  const choice = process.env.FIX_STRATEGY || 'null'

  try {
    let result

    switch (choice) {
      case 'null':
        console.log('Definindo quotationId como NULL para RequestItems órfãos...')
        result = await prisma.$executeRaw`
          UPDATE "RequestItem" 
          SET "quotationId" = NULL 
          WHERE "quotationId" IS NOT NULL 
          AND "quotationId" NOT IN (SELECT id FROM "Quotation")
        `
        console.log(`✅ ${result} RequestItems tiveram quotationId definido como NULL`)
        break

      case 'delete':
        console.log('⚠️  REMOVENDO RequestItems órfãos...')
        result = await prisma.$executeRaw`
          DELETE FROM "RequestItem" 
          WHERE "quotationId" IS NOT NULL 
          AND "quotationId" NOT IN (SELECT id FROM "Quotation")
        `
        console.log(`⚠️  ${result} RequestItems órfãos foram REMOVIDOS`)
        break

      default:
        console.log('❌ Estratégia de correção não reconhecida')
        console.log('Use: FIX_STRATEGY=null ou FIX_STRATEGY=delete')
        return
    }

    console.log('\n✅ Correção concluída! Agora você pode tentar executar a migration novamente.')
    console.log('Comando: npx prisma migrate dev')

  } catch (error) {
    console.error('❌ Erro durante correção:', error)
  }
}

async function main() {
  const args = process.argv.slice(2)

  console.log('🔍 ANALISADOR DE INTEGRIDADE DE DADOS')
  console.log('=====================================\n')

  if (args.includes('--structure-only')) {
    await analyzeTableStructures()
    await prisma.$disconnect()
    return
  }

  if (args.includes('--quick-fix')) {
    await executeQuickFix()
    await prisma.$disconnect()
    return
  }

  // Análise completa
  await analyzeTableStructures()
  const orphanedItems = await analyzeDataIntegrity()
  
  if (!args.includes('--analyze-only')) {
    await generateSolutions(orphanedItems)
    
    console.log('\n📖 COMANDOS DISPONÍVEIS:')
    console.log('========================')
    console.log('npx ts-node table-analyzer.ts --structure-only     # Ver apenas estruturas')
    console.log('npx ts-node table-analyzer.ts --analyze-only       # Análise sem soluções')
    console.log('FIX_STRATEGY=null npx ts-node table-analyzer.ts --quick-fix  # Correção segura')
    console.log()
    console.log('⚠️  SEMPRE faça backup do banco antes de executar correções!')
  }

  await prisma.$disconnect()
}

main().catch(console.error)