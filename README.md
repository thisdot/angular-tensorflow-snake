# Angular Tensorflow Snake

[![Snake Header][cover]][game_link]

An old school snake game with a twist - your hand is the controller!

The app aims to demonstrate the power of combining [Angular][angular_link] and
[Tensorflow][tensorflow_link] to build highly interactive and reactive
applications.

Built for [Google I/O 2023][google_io_link] with Angular 16.0.0-next.5 and
running in two versions:

- One using RxJS.
- And another using the new and awesome Angular signals.

Want to play right away? [Try the live app now][game_link] deployed from the
`main` branch to [Firebase][firebase_link].

_Built by [This Dot][this_dot_link] in partnership with the Angular Team at Google_

---

## Getting Started

First, run

```sh
npm install
```

to install all the dependencies.

To run the game locally on a development server, you can run the following
command:

```sh
npm start
```

To build the app, run the following command:

```sh
npm run build
```

## Linting and Formatting

To check for any linting issues, you can run the following command:

```sh
npm run lint
```

To fix automatically fixable linting issues, run:

```sh
npm run lint-fix
```

To check for any formatting issues, you can run the following command:

```sh
npm run format-check
```

To format all files to conform to the project's Prettier configuration, you can
run:

```sh
npm run format
```

## Running Tests

To run all unit tests use the following command:

```sh
npm run test-once
```

To run unit tests in watch mode, run:

```sh
npm run test
```

To generate a coverage report, you can run

```sh
npm run test-coverage
```

To view the generated coverage report you can open
[coverage/index.html](coverage/index.html) in a browser of your choice.

## Contributing

Pull Requests (PR) with bug fixes or features are welcome! Please see the
[contributing guidelines](./CONTRIBUTING.md) before submitting a PR.

If you have an idea for a new feature or a question regarding the app, please
open an issue first so it can be discussed and vetted before contributing.

[firebase_link]: https://firebase.google.com/
[game_link]: https://angular-tensorflow-snake.web.app/
[google_io_link]: https://io.google/
[angular_link]: https://angular.io/
[this_dot_link]: https://www.thisdot.co/
[tensorflow_link]: https://www.tensorflow.org/
[license_link]: https://opensource.org/licenses/MIT
[cover]: art/cover.svg
