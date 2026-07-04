import { Composition } from "remotion";
import { ShitClaudePromo } from "./ShitClaudePromo";

export const RemotionRoot = () => {
  return (
    <Composition
      id="ShitClaudePromo"
      component={ShitClaudePromo}
      durationInFrames={600}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
