import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Lê variáveis de ambiente do arquivo .env
function loadEnv() {
  const envPath = join(process.cwd(), '.env')
  if (!existsSync(envPath)) {
    throw new Error('Arquivo .env não encontrado!')
  }

  const envFile = readFileSync(envPath, 'utf-8')
  const env: Record<string, string> = {}

  envFile.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const equalIndex = trimmed.indexOf('=')
      if (equalIndex > 0) {
        const key = trimmed.substring(0, equalIndex).trim()
        const value = trimmed.substring(equalIndex + 1).trim()
        if (key && value) {
          env[key] = value
        }
      }
    }
  })
  
  console.log('📄 Variáveis encontradas:', Object.keys(env))

  return env
}

async function createTables() {
  try {
    const env = loadEnv()
    const supabaseUrl = env.VITE_SUPABASE_URL
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontrados no .env')
    }

    console.log('🔗 Conectando ao Supabase...')
    console.log(`📡 URL: ${supabaseUrl}`)

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Verificar se a tabela já existe
    console.log('\n🔍 Verificando se a tabela sales_data já existe...')
    const { data: existingData, error: checkError } = await supabase
      .from('sales_data')
      .select('count', { count: 'exact', head: true })

    if (checkError && checkError.code === 'PGRST116') {
      console.log('⚠️  A tabela não existe. A chave anon não permite criar tabelas via API.')
      console.log('\n📝 Por favor, execute o SQL abaixo no SQL Editor do Supabase:\n')
      console.log('─'.repeat(60))
      
      const sqlContent = readFileSync(join(process.cwd(), 'create-tables.sql'), 'utf-8')
      console.log(sqlContent)
      
      console.log('─'.repeat(60))
      console.log('\n📋 Instruções:')
      console.log('1. Acesse: https://xprfptktvktgoyopzany.supabase.co/project/default/sql')
      console.log('2. Clique em "New query"')
      console.log('3. Copie e cole todo o SQL acima')
      console.log('4. Clique em "Run" (ou Ctrl+Enter)\n')
      
    } else if (checkError) {
      console.error('❌ Erro ao verificar tabela:', checkError.message)
      console.log('\n📝 Execute o arquivo create-tables.sql no SQL Editor do Supabase\n')
    } else {
      console.log('✅ Tabela sales_data já existe!')
      console.log(`📊 Total de registros: ${existingData || 0}`)
    }

  } catch (error: any) {
    console.error('❌ Erro:', error.message)
    console.log('\n📝 Use o arquivo create-tables.sql no SQL Editor do Supabase')
    console.log('   Acesse: https://xprfptktvktgoyopzany.supabase.co/project/default/sql\n')
    process.exit(1)
  }
}

createTables()

