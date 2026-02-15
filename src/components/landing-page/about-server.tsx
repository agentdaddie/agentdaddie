const AboutServer = () => {
  return (
    <div className="bg-linear-to-b from-primary to- px-5 py-3 rounded-4xl">
      <div className="flex flex-col items-center justify-center  mb-12 space-y-3">
        <h1 className="text-4xl md:text-5xl font-semibold text-center text-white">
          One Click
          <br /> Deployment
        </h1>
        <p className="font-semibold text-base max-w-[18rem] md:max-w-sm text-center text-gray-50">
          We use DigitalOcean to deploy your OpenClaw. Platform known for being
          affordable, reliable, and fast. Simply connect your DigitalOcean account,
          and we’ll handle the entire deployment for you.
        </p>
      </div>
    </div>
  );
};

export default AboutServer;
