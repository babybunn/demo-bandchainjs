export default function Footer() {
  return (
    <div className="py-3 px-10 bg-white rounded-2xl mt-5 flex justify-between items-center">
      <p className="mb-0 text-sm text-gray-400">©{new Date().getFullYear()} | Bandprotocol </p>
      <p className="mb-0 text-sm text-gray-400">
        Designed and Developed by{" "}
        <a
          href="https://github.com/babybunn"
          target="_blank"
          rel="noreferrer"
          className="text-blue"
        >
          pangp
        </a>
      </p>
    </div>
  );
}
