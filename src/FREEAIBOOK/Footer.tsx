const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-300 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center">
        <p className="text-center text-xs sm:text-sm text-gray-600 select-none">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-indigo-600">ASKOXY.AI</span> —
          Empowering Minds with AI
        </p>
      </div>
    </footer>
  );
};

export default Footer;
