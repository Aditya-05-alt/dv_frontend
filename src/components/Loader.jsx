const Loader = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-8 h-8 border-4 border-t-4 border-gray-600 rounded-full animate-spin"></div>
      <span>Loading...</span>
    </div>
  );
};

export default Loader;
