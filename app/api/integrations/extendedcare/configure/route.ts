"use server"

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!
const IV_LENGTH = 16

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return iv.toString("hex") + ":" + encrypted
}

function clean(obj: Record<string, any>) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const type = body.type
    const integration_id = body.integration_id || uuidv4()

    if (!type) {
      return NextResponse.json({ success: false, message: "Missing type." }, { status: 200 })
    }

    if (type === "credentials") {
      const { username, password, client_id, client_secret, environment } = body

      if (!username || !password || !client_id || !client_secret || !environment) {
        return NextResponse.json({ success: false, message: "Missing credential fields.", received: body }, { status: 200 })
      }

      const { error } = await supabase.from("integration_credentials").upsert({
        id: integration_id,
        username,
        password: encrypt(password),
        client_id,
        client_secret: encrypt(client_secret),
        environment,
        created_at: new Date().toISOString(),
      })

      if (error) throw error
      return NextResponse.json({ success: true, integration_id }, { status: 200 })
    }

    if (type === "referral_rules") {
      const {
        accepted_insurance,
        reimbursement_rate,
        travel_distance,
        required_services,
        excluded_diagnoses,
        msw_notifications,
      } = body

      const { error } = await supabase.from("integration_referral_rules").upsert({
        integration_id,
        accepted_insurance,
        reimbursement_rate: reimbursement_rate,
        travel_distance: travel_distance,
        required_services,
        excluded_diagnoses,
        msw_notifications,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })

      if (error) throw error
      return NextResponse.json({ success: true }, { status: 200 })
    }

    if (type === "sync_settings") {
      const {
        auto_eligibility,
        auto_auth,
        real_time,
        batch,
        notify_msw,
        interval,
      } = body

      const { error } = await supabase.from("integration_sync_settings").upsert({
        integration_id,
        auto_eligibility,
        auto_auth,
        real_time,
        batch,
        notify_msw,
        interval,
      })

      if (error) throw error
      return NextResponse.json({ success: true }, { status: 200 })
    }

    if (type === "test-connection") {
      const { username, password } = body
      const simulatedSuccess = username.includes("@") && password.length >= 8

      const { error } = await supabase.from("monitoring_logs").insert({
        integration_id,
        type: "test-connection",
        status: simulatedSuccess ? "success" : "failed",
        message: simulatedSuccess ? "Connection successful" : "Invalid credentials",
        created_at: new Date().toISOString(),
      })

      if (error) throw error
      return NextResponse.json({ success: simulatedSuccess }, { status: 200 })
    }

    return NextResponse.json({ success: false, message: "Unknown type.", received: body }, { status: 200 })
  } catch (err: any) {
    console.error("Integration Save Error:", err)
    return NextResponse.json({ success: false, message: err.message, debug: err }, { status: 200 })
  }
}
