import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ==============================
// UPDATE TODO (PATCH)
// ==============================
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params // unwrap the Promise
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 })
    }

    const { completed, title, description } = await request.json()

    // Check ownership first
    const existingTodo = await prisma.todo.findUnique({ where: { id } })
    if (!existingTodo || existingTodo.userId !== session.user.id) {
      return NextResponse.json({ error: 'Todo not found or unauthorized' }, { status: 404 })
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(typeof completed === 'boolean' && { completed }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
      },
    })

    return NextResponse.json(todo)
  } catch (error) {
    console.error('Failed to update todo:', error)
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
  }
}

// ==============================
// DELETE TODO
// ==============================
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 })
    }

    // Check ownership first
    const existingTodo = await prisma.todo.findUnique({ where: { id } })
    if (!existingTodo || existingTodo.userId !== session.user.id) {
      return NextResponse.json({ error: 'Todo not found or unauthorized' }, { status: 404 })
    }

    await prisma.todo.delete({ where: { id } })

    return NextResponse.json({ message: 'Todo deleted' })
  } catch (error) {
    console.error('Failed to delete todo:', error)
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
  }
}
