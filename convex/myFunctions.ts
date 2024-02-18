import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { json } from "stream/consumers";
import { stringify } from "querystring";
import { anyApi } from "convex/server";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.




// You can read data from the database via a query function:
export const listProcedures = query({
  // Validators for arguments.
  args: {},

  // Query function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    return await ctx.db.query("ideas").collect();
  },
});

// You can write data to the database via a mutation function:
export const setMedDes = mutation({
  // Validators for arguments.
  args: {
    idea: v.string(),
    random: v.boolean(),
  },

  // Mutation function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.

    // Optionally, capture the ID of the newly created document
    const id = await ctx.db.insert("ideas", args);

    // Optionally, return a value from your mutation.
    return id;
  },
});

// You can fetch data from and send data to third-party APIs via an action:
export const fetchHealthInfo = action({
  // Validators for arguments.
  args: {
    healthinfo: v.string(),
    random: v.boolean()
  },

  // Action implementation.
  handler: async (ctx, args) => {
    // Use the browser-like `fetch` API to send HTTP requests.
    // See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
    try {

      const response = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer 4fbc78f4cae052bc8b2b358646e3ffad231f7241da976fa649b06168141e15b3',
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-2-70b-chat-hf",
          max_tokens: 2048,
          messages: [
            {
              role: "system",
              content: `You are a JSON server that only responds in JSON format. In JSON format, for a medical condition user enters return a comprehensive JSON of common medical procedures usually done for that condition in hospitals with specific descriptive names, brief medical explanations, CPT codes, and HCPCS codes. If you are not sure about a CPT or HCPCS code, just write n/a instead. Don't hallucinate codes! The json fields for each procedure should be: "Name", "Explanation", "CPT", "HCPCS". ONLY RETURN THE JSON WITHOUT ANY OTHER TEXT. YOU ARE SENDING THIS TO A JSON INTERPRETER.`,
            },
            {
              role: "user",
              content: args.healthinfo,
            },
          ],
          temperature: 0.2,
          top_p: 0.7,
          top_k: 50,
          repetition_penalty: 1,
          stream_tokens: false,
          stop: ["[/INST]", "</s>"],
          repetitive_penalty: 1,
          update_at: "2024-02-17T22:14:42.376Z",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

    const responseData = await response.json();
    var parse = responseData.choices[0].message.content;
    parse = parse.replace("n\/a/g", "n/a");
    const parsedData = JSON.parse(parse);

    console.log(parse)

    // console.log(responseData.choices[0].message.content)
    return responseData;

    } catch (error) {
      console.error(error);
    }

  }

  // const costs = await response;
  // console.log(costs)

  // Write or query data by running Convex mutations/queries from within an action
  // await ctx.runMutation(api.myFunctions.setMedDes, {
  //   idea: costs.trim(),
  //   random: true,
  // });

  // Optionally, return a value from your action
  // return idea;

});

