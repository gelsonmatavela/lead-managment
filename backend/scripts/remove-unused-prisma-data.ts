import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixQuotationItemNulls() {
  console.log('🔧 CORRIGINDO QUOTATIONITEMS COM QUOTATIONID NULL')
  console.log('================================================\n')

  try {
    // Verificar quantos QuotationItems têm quotationId NULL
    console.log('🔍 Verificando QuotationItems problemáticos...')
    
    const nullCountQuery = await prisma.$queryRaw<Array<{count: bigint}>>`
      SELECT COUNT(*) as count
      FROM "QuotationItem" 
      WHERE "quotationId" IS NULL
    `
    
    const nullCount = Number(nullCountQuery[0]?.count || 0)
    console.log(`📊 QuotationItems com quotationId NULL: ${nullCount}`)
    
    if (nullCount === 0) {
      console.log('✅ Nenhum QuotationItem problemático encontrado!')
      console.log('Você pode executar: npx prisma db push')
      return
    }

    // Mostrar alguns exemplos dos registros problemáticos
    console.log('\n📋 Exemplos de QuotationItems que serão removidos:')
    
    const examplesQuery = await prisma.$queryRaw<Array<{
      id: string
      itemId: string
      quantity: number
      createdAt: Date
    }>>`
      SELECT 
        qi.id,
        qi."itemId",
        qi.quantity,
        qi."createdAt"
      FROM "QuotationItem" qi
      WHERE qi."quotationId" IS NULL
      ORDER BY qi."createdAt" DESC
      LIMIT 5
    `

    examplesQuery.forEach((item, index) => {
      console.log(`${index + 1}. ID: ${item.id}`)
      console.log(`   ItemId: ${item.itemId}`)
      console.log(`   Quantidade: ${item.quantity}`)
      console.log(`   Criado: ${item.createdAt}`)
      console.log()
    })

    if (nullCount > 5) {
      console.log(`   ... e mais ${nullCount - 5} registros similares`)
      console.log()
    }

    // Perguntar confirmação (em ambiente real, você pode pular isso)
    console.log('⚠️  ATENÇÃO: Estes QuotationItems serão REMOVIDOS permanentemente!')
    console.log('Esta é a única forma de resolver o problema de schema.')
    console.log()

    // Executar a remoção
    console.log('🗑️  Removendo QuotationItems com quotationId NULL...')
    
    const deleteResult = await prisma.$executeRaw`
      DELETE FROM "QuotationItem" 
      WHERE "quotationId" IS NULL
    `

    console.log(`✅ ${deleteResult} QuotationItems removidos com sucesso!`)

    // Verificação final
    const finalCountQuery = await prisma.$queryRaw<Array<{count: bigint}>>`
      SELECT COUNT(*) as count
      FROM "QuotationItem" 
      WHERE "quotationId" IS NULL
    `
    
    const finalCount = Number(finalCountQuery[0]?.count || 0)

    if (finalCount === 0) {
      console.log('\n🎉 PROBLEMA RESOLVIDO!')
      console.log('=====================')
      console.log('✅ Todos os QuotationItems agora têm quotationId válido')
      console.log('✅ Você pode executar: npx prisma db push')
      console.log('✅ Depois: npx prisma migrate dev')
    } else {
      console.log(`\n⚠️  Ainda restam ${finalCount} QuotationItems problemáticos`)
      console.log('Execute o script novamente se necessário.')
    }

  } catch (error) {
    console.error('❌ Erro durante correção:', error)
    
    console.log('\n💡 SOLUÇÃO ALTERNATIVA:')
    console.log('======================')
    console.log('Execute diretamente no banco:')
    console.log('DELETE FROM "QuotationItem" WHERE "quotationId" IS NULL;')
  }
}

async function main() {
  console.log('🔧 CORRETOR DE QUOTATIONITEM - VERSÃO SIMPLES')
  console.log('==============================================\n')
  
  await fixQuotationItemNulls()
  await prisma.$disconnect()
}

main().catch(async (error) => {
  console.error('❌ Erro:', error)
  await prisma.$disconnect()
  process.exit(1)
})