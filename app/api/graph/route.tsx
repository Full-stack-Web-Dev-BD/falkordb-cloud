import authOptions, { getEntityManager } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from "next-auth/next"
import { NextRequest, NextResponse } from "next/server";
import { UserEntity } from '../models/entities';
import { createClient } from 'redis';


export async function GET() {

    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: "You must be logged in." }, { status: 401 })
    }

    const email = session.user?.email;
    if (!email) {
        return NextResponse.json({ message: "Can't find user details" }, { status: 500 })
    }

    let manager = await getEntityManager()
    const user = await manager.findOneBy(UserEntity, {
        email: email
    })

    const client = user?.tls ?
        await createClient({
            url: `rediss://:${user?.db_password}@${user?.db_host}:${user?.db_port}`,
            socket: {
                tls: true,
                rejectUnauthorized: false,
                ca: user?.cacert ?? ""
            }
        }).connect()
        : await createClient({
            url: `redis://:${user?.db_password}@${user?.db_host}:${user?.db_port}`
        }).connect();;


    try {
        let result = await client.graph.list()
        return NextResponse.json({ result: { graphs: result } }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 })
    }
}
