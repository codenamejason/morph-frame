import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/vercel";

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

app.frame("/", (context) => {
  const { buttonValue, inputText, status } = context;
  const fruit = inputText || buttonValue;
  return context.res({
    image:
      status === "response"
        ? tempImage(`Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ""}`)
        : tempImage(
            "Welcome! Enter a name to get started creating a profile on Allo v2."
          ),
    intents: [
      <TextInput placeholder="Enter custom fruit..." />,
      <Button value="apples">Apples</Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

// step 1 - enter the name of the profile
app.frame("register-profile-1", (context) => {
  const { buttonValue, inputText, status, verified } = context;
  const name = inputText || buttonValue;

  if (!verified) {
    return context.res({
      image: tempImage("refresh the page"),
      intents: [<Button.Reset>Reset</Button.Reset>],
    });
  }
  return context.res({
    image: tempImage(`Nice to meet you, ${name}!`),
    intents: [
      <TextInput placeholder="Enter your name..." />,
      <TextInput placeholder="Enter your email..." />,
      <Button>Submit</Button>,
    ],
  });
});

const tempImage = (content: string) => (
  <div
    style={{
      alignItems: "center",
      background:
        status === "response"
          ? "linear-gradient(to right, #432889, #17101F)"
          : "black",
      backgroundSize: "100% 100%",
      display: "flex",
      flexDirection: "column",
      flexWrap: "nowrap",
      height: "100%",
      justifyContent: "center",
      textAlign: "center",
      width: "100%",
    }}
  >
    <div
      style={{
        color: "white",
        fontSize: 60,
        fontStyle: "normal",
        letterSpacing: "-0.025em",
        lineHeight: 1.4,
        marginTop: 30,
        padding: "0 120px",
        whiteSpace: "pre-wrap",
      }}
    >
      {status === "response"
        ? `Nice choice.${content ? ` ${content}` : ""}`
        : "Welcome!"}
    </div>
  </div>
);

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
