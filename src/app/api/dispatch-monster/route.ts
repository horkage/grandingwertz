// app/api/dispatch-monster/route.ts
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get user from session
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user_id = session.user.id

    // Get monster_id from request body
    const { monster_id } = await req.json()

    if (!monster_id) {
      return NextResponse.json({ error: 'Missing monster_id' }, { status: 400 })
    }

    // Call the RPC
    const { data, error } = await supabase.rpc('dispatch_monster', {
      p_player_monster_id: monster_id,
      p_user_id: user_id
    })

    if (error) {
      console.error('RPC error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: unknown) {
    console.error('Unexpected error dispatching monster:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
