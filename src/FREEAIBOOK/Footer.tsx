const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-900 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-3 flex flex-col items-center">
        <p className="text-xs sm:text-sm text-gray-600 text-center">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">ASKOXY.AI</span> — Empowering Minds
          with AI
        </p>
      </div>
    </footer>
  );
};

export default Footer;
