const Loading = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)] w-full bg-base-200 rounded-lg mx-2">
      <div>
        <span className="loading loading-dots text-primary loading-lg"></span>
      </div>
    </div>
  );
};

export default Loading;
