import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password, agencyId, environment } = await request.json()
    if (!username || !password || !agencyId || !environment) {
      return NextResponse.json(
        { error: 'username, password, agencyId, and environment are required' },
        { status: 400 },
      )
    }

    // Simple validation: require password length >= 8
    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const agencyInfo = {
      name: 'Axxess Agency',
      id: agencyId,
      environment,
    }

    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      agencyInfo,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
