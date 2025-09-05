import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface IntegrityError {
  table: string
  field: string
  invalidId: any
  count: number
  sampleRecords?: Array<{id: any, [key: string]: any}>
}

interface InvalidIdResult {
  quotationId?: any
  requestId?: any
  count: bigint
}

async function checkForeignKeyIntegrity() {
  console.log('🔍 Iniciando verificação de integridade de chaves estrangeiras...\n')
  
  const errors: IntegrityError[] = []

  try {
    // 1. Verificar RequestItem -> Quotation
    console.log('📋 Verificando RequestItem.quotationId...')
    const invalidQuotationIds = await prisma.$queryRaw<InvalidIdResult[]>`
      SELECT ri.quotationId, COUNT(*) as count
      FROM "RequestItem" ri
      LEFT JOIN "Quotation" q ON ri.quotationId = q.id
      WHERE ri.quotationId IS NOT NULL AND q.id IS NULL
      GROUP BY ri.quotationId
    `

    if (invalidQuotationIds.length > 0) {
      for (const invalid of invalidQuotationIds) {
        const sampleRecords = await prisma.requestItem.findMany({
          where: { quotationId: invalid.quotationId },
          take: 5,
          select: { id: true, quotationId: true }
        })

        errors.push({
          table: 'RequestItem',
          field: 'quotationId',
          invalidId: invalid.quotationId,
          count: Number(invalid.count),
          sampleRecords
        })
      }
    }

    // 2. Verificar outras relações comuns (adapte conforme seu schema)
    
    // RequestItem -> Request (se existir)
    console.log('📋 Verificando RequestItem.requestId...')
    const invalidRequestIds = await prisma.$queryRaw<InvalidIdResult[]>`
      SELECT ri.requestId, COUNT(*) as count
      FROM "RequestItem" ri
      LEFT JOIN "Request" r ON ri.requestId = r.id
      WHERE ri.requestId IS NOT NULL AND r.id IS NULL
      GROUP BY ri.requestId
    `

    if (invalidRequestIds.length > 0) {
      for (const invalid of invalidRequestIds) {
        const sampleRecords = await prisma.requestItem.findMany({
          where: { requestId: invalid.requestId },
          take: 5,
          select: { id: true, requestId: true }
        })

        errors.push({
          table: 'RequestItem',
          field: 'requestId',
          invalidId: invalid.requestId,
          count: Number(invalid.count),
          sampleRecords
        })
      }
    }

    // 3. Verificar Quotation -> outras tabelas (se aplicável)
    // Adicione outras verificações conforme necessário...

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error)
    return
  }

  // Relatório de resultados
  console.log('\n📊 RELATÓRIO DE INTEGRIDADE DE DADOS')
  console.log('=====================================\n')

  if (errors.length === 0) {
    console.log('✅ Nenhum problema de integridade encontrado!')
  } else {
    console.log(`❌ Encontrados ${errors.length} problemas de integridade:\n`)

    errors.forEach((error, index) => {
      console.log(`${index + 1}. Tabela: ${error.table}`)
      console.log(`   Campo: ${error.field}`)
      console.log(`   ID inválido: ${error.invalidId}`)
      console.log(`   Registros afetados: ${error.count}`)
      
      if (error.sampleRecords && error.sampleRecords.length > 0) {
        console.log('   Exemplos de registros:')
        error.sampleRecords.forEach(record => {
          const fieldValue = (record as any)[error.field]
          console.log(`     - ID: ${record.id}, ${error.field}: ${fieldValue}`)
        })
      }
      console.log()
    })

    // Sugestões de correção
    console.log('💡 SUGESTÕES DE CORREÇÃO')
    console.log('========================\n')

    errors.forEach((error, index) => {
      console.log(`${index + 1}. Para ${error.table}.${error.field} = ${error.invalidId}:`)
      
      if (error.field === 'quotationId') {
        console.log('   Opções:')
        console.log(`   a) Criar uma Quotation com ID ${error.invalidId}`)
        console.log('   b) Atualizar os RequestItems para referenciar uma Quotation existente')
        console.log('   c) Remover os RequestItems órfãos (CUIDADO!)')
        console.log()
        console.log('   Comandos SQL sugeridos:')
        console.log(`   -- Opção A: Criar Quotation`)
        console.log(`   INSERT INTO "Quotation" (id, ...) VALUES (${error.invalidId}, ...);`)
        console.log()
        console.log(`   -- Opção B: Atualizar para ID existente (substitua NEW_ID)`)
        console.log(`   UPDATE "RequestItem" SET quotationId = NEW_ID WHERE quotationId = ${error.invalidId};`)
        console.log()
        console.log(`   -- Opção C: Remover registros órfãos (PERIGOSO!)`)
        console.log(`   DELETE FROM "RequestItem" WHERE quotationId = ${error.invalidId};`)
      }
      
      console.log()
    })
  }

  await prisma.$disconnect()
}

async function fixOrphanedData() {
  console.log('🔧 Iniciando correção automática de dados órfãos...\n')
  
  try {
    // Opção 1: Definir quotationId como NULL para registros órfãos
    // (apenas se o campo permitir NULL no seu schema)
    const updateResult = await prisma.$executeRaw`
      UPDATE "RequestItem" 
      SET quotationId = NULL 
      WHERE quotationId NOT IN (SELECT id FROM "Quotation")
      AND quotationId IS NOT NULL
    `
    
    console.log(`✅ ${updateResult} registros RequestItem tiveram quotationId definido como NULL`)

  } catch (error) {
    console.error('❌ Erro durante a correção automática:', error)
    console.log('💡 Você pode precisar executar as correções manualmente usando as sugestões acima.')
  }

  await prisma.$disconnect()
}

// Função principal
async function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--fix')) {
    await fixOrphanedData()
  } else {
    await checkForeignKeyIntegrity()
    
    console.log('\n💡 Para tentar uma correção automática, execute:')
    console.log('   npx ts-node check-integrity.ts --fix')
    console.log('\n⚠️  AVISO: Sempre faça backup do banco antes de executar correções!')
  }
}

main().catch(console.error)