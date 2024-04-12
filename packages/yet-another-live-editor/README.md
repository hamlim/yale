# `yet-another-live-editor`

## Usage

Install the package:

```sh
bun add yet-another-live-editor
```

Then use the package:

```tsx
import { Editor } from "yet-another-live-editor";

export default function App() {
  let [code, setCode] = useState(`export default function App() {
    return <div>Hello World</div>
  }`);
  return (
    <Editor
      code={code}
      onChange={setCode}
    />
  );
}
```

## Development:

To install dependencies:

```bash
bun install
```

### Building:

This library uses [`swc`](https://swc.rs/) and [`TypeScript`](https://www.typescriptlang.org/docs/) to build the source code and generate types.

To build the library, run `bun run build` from the root, or from this workspace!

### Code Quality:

#### Type Checking:

This library uses TypeScript to perform type checks, run `bun run type-check` from the root or from this workspace!

#### Linting

This library uses [BiomeJS](https://biomejs.dev/) for linting, run `bun run lint` from the root or from this workspace!

#### Tests

This library uses Bun for running unit tests, run `bun run test` from the root or from this workspace!

### Publishing:

To publish the library, run `bun run pub` from the workspace root. This will prompt you to login to npm and publish the package.

> Note: In the future, we will automate this process using GitHub Actions. And also add in tooling to manage releases / changelogs!
