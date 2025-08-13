export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl md:text-5xl font-bold text-[#008B8B] mb-4">
        Welcome to QRCodeAttend
      </h1>
      <p className="text-gray-600 text-lg text-center max-w-xl">
        A simple and secure way to manage attendance using QR codes.
      </p>
    </div>
  );
}
