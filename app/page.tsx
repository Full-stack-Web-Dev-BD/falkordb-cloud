import Link from "next/link";

export default function Page() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{' '}
          <Link className="text-blue-600 underline underline-offset-2" href="/sandbox">
            FalkorDB Cloud
          </Link>
        </h1>
        <p className="mt-3 text-4xl">(Sandbox)</p>
      </main>
    </div>
  )
}

