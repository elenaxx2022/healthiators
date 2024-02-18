import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function App() {
  const [medicaldescription, setMedDes] = useState("");
  const [includeRandom, setIncludeRandom] = useState(true);

  const procedures = useQuery(api.myFunctions.listProcedures);
  const saveIdea = useMutation(api.myFunctions.setMedDes);
  const fetchHealthInfo = useAction(api.myFunctions.fetchHealthInfo);

  return (
    <>
      <main className="container max-w-2xl flex flex-col gap-8">
        <h1 className="text-3xl font-extrabold mt-8 text-center">
          Get A Transparent Bill
        </h1>

        <h2 className="text-center">Please describe your medical problem</h2>

        <form className="flex gap-2">
          <Input
            type="text"
            value={medicaldescription}
            onChange={(event) => setMedDes(event.target.value)}
            placeholder="Type medical condition here"
          />
          <Button
            type="submit"
            disabled={!medicaldescription}
            title={
              medicaldescription
                ? "Get cost overview"
                : "You must enter your medical issue first"
            }
            onClick={async (e) => {
              e.preventDefault();
              await fetchHealthInfo({
                healthinfo: medicaldescription.trim(),
                random: false,
              });
              setMedDes("");
            }}
            className="min-w-fit"
          >
            Get Cost Overview
          </Button>
        </form>

        <ul>
          {procedures?.map((document, i) => (
            <li key={i}>
              {document.random ? "🤖 " : "🤖"}
              {document.Name}, CPT: {document.CPT}
            </li>
          ))}
        </ul>
      </main>
      <footer className="text-center text-xs mb-5 mt-10 w-full">
        <p>
          Built for <a href="https://live.treehacks.com/">TreeHacks2024</a>
        </p>
      </footer>
    </>
  );
}

export default App;
