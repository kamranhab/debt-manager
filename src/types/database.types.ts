export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      debts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          creditor: string
          amount: number
          description: string
          due_date: string
          status: 'PENDING' | 'PAID'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          creditor: string
          amount: number
          description: string
          due_date: string
          status?: 'PENDING' | 'PAID'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          creditor?: string
          amount?: number
          description?: string
          due_date?: string
          status?: 'PENDING' | 'PAID'
        }
      }
      payments: {
        Row: {
          id: string
          created_at: string
          debt_id: string
          amount: number
          payment_date: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          debt_id: string
          amount: number
          payment_date: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          debt_id?: string
          amount?: number
          payment_date?: string
          notes?: string | null
        }
      }
    }
  }
}