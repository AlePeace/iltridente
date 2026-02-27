import { NextResponse } from "next/server";

const { revalidatePath } = require("next/cache");

async function handler(){
    revalidatePath("/", "layout");
    return NextResponse.json({ message: "Revalidation triggered" });
}

export { handler as POST, handler as GET };