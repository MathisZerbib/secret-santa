// pages/index.tsx or app/page.tsx (depending on your Next.js version)

"use client";

import Provider from "@/components/provider";
import Landing from "../components/Landing";

function Home() {
  return (
    <>
      <Provider>
        <Landing />
      </Provider>
    </>
  );
}

export default Home;
