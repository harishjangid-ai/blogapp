import { Mention, MentionsInput } from "react-mentions";

export default function Test() {
  return (
    <div>
      Hello
      <MentionsInput
        value=""
        onChange={() => {}}
      >
        <Mention
          trigger="@"
          data={[
            {
              id: "1",
              display: "harish",
            },
          ]}
        />
      </MentionsInput>
    </div>
  );
}