import { supabase } from '@/lib/supabase'

interface MessageRow {
  id: number;
  message: string;
}


export default async function Home() {
  const { data, error } = await supabase.from('test_data').select('*')
  
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Hello from Supabase</h1>
      {error && <p className="text-red-500">Error: {error.message}</p>}
      <ul className="mt-4 list-disc list-inside">
        {data?.map((row: MessageRow) => (
          <li key={row.id}>{row.message}</li>
        ))}
      </ul>
      what a time to be alive
    </main>
  )
}