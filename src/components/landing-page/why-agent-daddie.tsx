import { HighlightedComponent } from "./hero";

const WhyAgentDaddie = () => {
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center md:text-balance flex flex-col items-center">
        <h1 className="text-4xl lg:text-5xl font-semibold text-center leading-14">
          Why Agent <br />
          Daddie ?
        </h1>
        <div className="text-base text-muted-foreground mt-2 font-semibold max-w-sm">
          We are the first platform that allows users to deploy OpenClaw on
          their <HighlightedComponent text="own server" /> with just one click
        </div>
      </div>

      {/* <div className="flex items-center justify-center mt-5 gap-2">
        <div>
          <p className="text-sm relative font-semibold tracking-wide">
            Aditya Pushkar
          </p>
          <p className="text-xs font-medium text-zinc-500 text-center">
            @aditya_pushkar
          </p>
        </div>
      </div> */}

      <div className="pt-10 px-3 md:px-0 mx-auto mt-10 border-t prose prose-invert text-muted-foreground prose-a:font-semibold prose-p:font-semibold prose-p:text-sm border-border">
        <h4>No Technical Skills Required</h4>
        <p>
          Our platform is a cheat code for setting up OpenClaw on your own
          server if you are not technical. Connect your DigitalOcean account,
          and we will handle everything else. No command lines, no configuration
          files, no headaches. Just sit back, relax, and watch your OpenClaw
          instance come to life.
        </p>

        <h4>Security</h4>
        <p>
          Here is the deal: OpenClaw saves tokens and API keys in plain text.
          That means handing your setup to some random hosted service is
          basically giving strangers the keys to your kingdom. Self hosting
          keeps your credentials on YOUR server, under YOUR control not floating
          around someone elses database.
        </p>

        <h4>Approach</h4>
        <p>
          We keep it simple and transparent. You stay in full control of your
          setup from start to finish. Plus, we are fully open source. No black
          boxes, just code you can inspect and trust. Our job? Get OpenClaw
          running on your server in minutes without making your head spin.
          Starting with{" "}
          <span className="bg-primary font-mono text-xs font-medium text-white px-2">
            DigitalOcean
          </span>{" "}
          with more platforms coming soon.
        </p>

        <h4>Your Server, Your Rules</h4>
        <p>
          When you run OpenClaw on your own server, you are the boss. Scale it
          however you want, keep it running 24/7 for your team, and configure it
          your way. No platform telling you what you can or cant do.
        </p>
      </div>
    </div>
  );
};

export default WhyAgentDaddie;
