export const AGENT_TOOLS = {
  get_weather: async ({ location }: { location: string }) => {
    console.log(`ACTING: Getting weather for ${location}`);
    return `The weather in ${location} is 28°C and sunny.`;
  },
  search_users: async ({ query }: { query: string }) => {
    console.log(`ACTING: Searching users for ${query}`);
    const users = [
      { id: 1, name: "Sulaiman", role: "Senior Architect" },
      { id: 2, name: "Rizin", role: "MERN Developer" },
    ];
    return users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()));
  },
  search_places: async ({ category }: { category?: string }) => {
    console.log(`ACTING: Searching places in Kerala for ${category || "all"}`);
    const places = [
      { name: "Kochi", type: "City", highlight: "Marine Drive & Fort Kochi" },
      { name: "Munnar", type: "Hill Station", highlight: "Tea Plantations" },
      { name: "Alleppey", type: "Backwaters", highlight: "Houseboat Cruises" },
      { name: "Wayanad", type: "Nature", highlight: "Banasura Sagar Dam" },
    ];
    if (!category || category.toLowerCase() === "all" || category === "") return places;
    return places.filter(
      (p) =>
        p.type.toLowerCase().includes(category.toLowerCase()) ||
        p.name.toLowerCase().includes(category.toLowerCase())
    );
  },
};

export const TOOL_DEFINITIONS = [
  {
    function: {
      name: "get_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    function: {
      name: "search_users",
      description: "Search for users by name",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The name of the user to search for",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    function: {
      name: "search_places",
      description:
        "Search for beautiful places to visit in Kerala, India. If category is omitted or 'all', it returns all top destinations.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "Optional: The type of place (e.g., City, Nature, Backwaters) or 'all' to see everything.",
          },
        },
        required: [], // Making it optional
      },
    },
  },
];
