import 'dotenv/config'
import { createClient } from '@libsql/client'
import crypto from 'crypto'

const API_KEY = process.env.AUTORIA_API_KEY
const CATEGORY_ID = 1 // Passenger cars
const DB_PATH = 'file:/Users/apple/Desktop/Automobility/dev.db'

if (!API_KEY) {
    console.error('AUTORIA_API_KEY is not defined in .env')
    process.exit(1)
}

const client = createClient({
    url: DB_PATH,
})

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
        const res = await fetch(url)
        if (res.status === 429) {
            console.warn(`⚠️ Rate limited (429). Waiting 15 seconds... (Attempt ${i + 1}/${retries})`)
            await new Promise(r => setTimeout(r, 15000))
            continue
        }
        if (!res.ok) throw new Error(`HTTP Error: ${res.status} ${res.statusText}`)
        return res.json()
    }
    throw new Error(`Failed after ${retries} retries`)
}

async function syncCatalog() {
    console.log('🚀 Starting Auto.ria catalog synchronization (Direct SQLite mode)...')
    
    try {
        // 1. Fetch all brands (marks)
        console.log('Fetching brands for Category 1...')
        const brands = await fetchWithRetry(`https://developers.ria.com/auto/categories/${CATEGORY_ID}/marks?api_key=${API_KEY}`)
        
        console.log(`Found ${brands.length} brands. Clearing database table 'CarCatalog'...`)
        await client.execute('DELETE FROM CarCatalog')

        let totalModelsCount = 0
        const brandsToTrack = brands.length
        
        // 2. Iterate and fetch models for each brand
        for (let i = 0; i < brandsToTrack; i++) {
            const brand = brands[i]
            console.log(`[${i + 1}/${brandsToTrack}] Processing ${brand.name}...`)
            
            try {
                const models = await fetchWithRetry(`https://developers.ria.com/auto/categories/${CATEGORY_ID}/marks/${brand.value}/models?api_key=${API_KEY}`)
                const now = new Date().toISOString()
                
                if (models.length > 0) {
                    console.log(`  Adding ${models.length} models...`)
                    // Batching inserts for efficiency
                    for (const m of models) {
                        const id = crypto.randomUUID()
                        await client.execute({
                            sql: 'INSERT INTO CarCatalog (id, brand, model, yearFrom, yearTo, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            args: [id, brand.name, m.name, 1990, 2025, 'Passenger', now]
                        })
                        totalModelsCount++
                    }
                }
                
                // 1.2s delay to respect RI-API rate limits (usually 1 req/sec for free keys)
                await new Promise(r => setTimeout(r, 1200))
                
            } catch (err) {
                console.error(`❌ Error processing brand ${brand.name}:`, err.message)
                // Continue to next brand instead of failing completely
            }
        }
        
        console.log(`\n✅ Synchronization finished!`)
        console.log(`Total Brands processed: ${brandsToTrack}`)
        console.log(`Total Models added: ${totalModelsCount}`)
        
    } catch (error) {
        console.error('💥 FATAL SYNC ERROR:', error.message)
    }
}

syncCatalog()
