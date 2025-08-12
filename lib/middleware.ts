import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getToken } from "next-auth/jwt";
import { errorResponse } from "@/lib/api-response";

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return errorResponse("Unauthorized", 401);
  }

  return session;
}

export async function requireAdmin() {
  const session = await getAuthSession();
  
  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { message: "Admin access required" },
      { status: 403 }
    );
  }

  return session;
} 