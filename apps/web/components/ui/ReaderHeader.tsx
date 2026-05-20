import Link from "next/link"

const ReaderHeader = () => {
  return (
    <div className="flex flex-col items-center gap-3 mt-3">
        <h1 className="text-3xl font-semibold">Discover Stories & Insights</h1>
        <p className="text-xl font-thin text-gray-600/40">Read, share, and connect with writers from around the world</p>
        <div className="flex gap-5">
            <Link href={"/reader"} className="bg-black text-white px-4 py-2 rounded">Start Reading</Link>
            <Link href={"/reader/become-writer"} className="border border-black px-4 py-2 rounded">Become a Writer</Link>
        </div>
    </div>
  )
}

export default ReaderHeader