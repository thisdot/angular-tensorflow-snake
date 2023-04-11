# Angular TensorFlow.js Snake

[![Snake Header][cover]][game_link]

An old school snake game with a twist - your hand is the controller!

The app aims to demonstrate the power of combining [Angular][angular_link] and
[TensorFlow.js][tensorflow_link] to build highly interactive and reactive
applications.

Built for [Google I/O 2023][google_io_link] with Angular 16.0.0-next.5 and
running in two versions:

- One using RxJS.
- And another using the new and awesome Angular signals.

Want to play right away? [Try the live app now][game_link] deployed from the
`main` branch to [Firebase][firebase_link].

_Built by [This Dot][this_dot_link] in partnership with the Angular Team at
Google_

---

## 1. Getting Started

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
npm run lint:fix
```

To check for any formatting issues, you can run the following command:

```sh
npm run format:check
```

To format all files to conform to the project's Prettier configuration, you can
run:

```sh
npm run format
```

## Running Tests

To run all unit tests use the following command:

```sh
npm run test:once
```

To run unit tests in watch mode, run:

```sh
npm run test
```

To generate a coverage report, you can run

```sh
npm run test:coverage
```

To view the generated coverage report you can open
[coverage/index.html](coverage/index.html) in a browser of your choice.

## 2. Architecture Overview

The app is a fully standalone Angular application and it contains two different
implementations of the game - one where communication is done with **signals**
and another where the communication is realized via **RxJs**.

### 2.1 The Game Service(s)

The game itself is realized via a **Game Service** which holds the information
about the game state, moves the snake in ticks according to given speed and
exposes methods to `setup()`, `start()` and `pause()` the game.

The `setup()` method takes an optional `config` argument, in which the following
options can be set:

| Option       | Type          | Description                                                                                                                    | Default Value                                                                  |     |
| ------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | --- |
| gridSize     | `GridSize`    | An object specifying width and height of the grid (number of tiles on the _x_ and _y_ axis).                                   | `{ width: 10, height: 10 }`                                                    |     |
| snake        | `Snake`       | An instance of the `Snake` class containing the snake segments coordinates (e.g. `new Snake({ x: 1, y: 1})`).                  | A Snake instance with one segment placed at a random position within the grid. |     |
| food         | `Coordinates` | An object specifying _x_ and _y_ coordinates of the "apple" on the grid.                                                       | A random position on the grid.                                                 |     |
| initialSpeed | `number`      | A number that determines how many times per second the snake moves in the game, with higher values leading to faster movement. | `2` (Two ticks per second.)                                                    |     |

Furthemore, the service exposes a `setDirection(direction: Direction)` as a way
to inform the game about where the snake should be heading, meaning that, in
theory, any kind of controller can be used to control the game. The `Direction`
enum is specified as follows:

| Key     | Value |
| ------- | :---: |
| `Left`  |  👈   |
| `Right` |  👉   |
| `Up`    |  ☝️   |
| `Down`  |  👇   |

There are two different implementation of the game service within the app:

- `SignalsGameService`, which communicates the game state using Angular
  **signals**.
- `RxjsGameService`, which communicates the state using **RxJs Observables**.

Both classes inherit from a common abstract `GameServiceBase` class which
contains some common code and specifies the `setup()`, `start()`, `pause()` and
`setDirection()` methods as abstract methods to ensure common public interface:

[![Diagram of the Game Service][game_service_diagram]][game_service_diagram]

The classes, models and utility functions are located in the
[src/app/game](./src/app/game) folder.

### 2.2 The Game UI

The components that handle the game UI live in the
[src/app/game/game-board](./src/app/game/game-board) folder and, similar to the
services, there are two different components:

- `SignalsGameBoardComponent`, which injects the `SignalsGameService` and
  communicates with it via Angular **signals**.
- `RxjsGameBoardComponent`, which injects the `RxjsGameService` and communicates
  with it via **RxJS Observables** and **async pipes**.

Both components share the same `game-board.component.scss` file for styles and
utility functions defined in `game-board.utils.ts` file.

### 2.3 Routing

The two different implementations are available via **routing**:

- The **/signals** route provides the `SignalsGameService` and displays the
  `SignalsGameBoardComponent`.
- The **/rxjs** route provides the `RxjsGameService` and displays the
  `RxjsGameBoardComponent`.

Other components are shared between implementations and they inject the
`GameServiceBase` which resolves to the correct instance of the game service
specified in the routing configuration via the `useExisting` Angular providers
mechanism.

By default, the **signals** route is displayed. If you want to check out the
RxJs version, you'll need to manually change the url in your browser from
**"/signals"** to **"/rxjs"**.

Refer to [src/main.ts](./src/main.ts) for more details about how the routing and
providers are configured.

### 2.4 The Game Controller

The game controller code lives in the [src/app/controller](./src/app/controller)
folder. The UI is handled by the `ControllerComponent` which further references
the `ArrowsComponent` to display the direction pad which visualizes the current
direction the user is pointing to, the `ControlButtonsComponent` which displays
the buttons to start, pause and reset the game and calls the game service
accordingly and the `WebcamComponent` which displays the camera feed.

#### 2.4.1 The Game Controlling Mechanism

The actual mechanism to control the game is realized by two directives which are
meant to be added to a `<video>` tag:

- The `CameraFeedDirective` which uses the `NavigatorService` to capture user's
  camera and output the feed into the `<video>` tag.
- The `HandDetectorDirective` which imports TensorFlow.js WebGl backend and the
  pre-trained [hand pose detection model](), which is then used to estimate a
  direction where the user's hand is pointing and sends it upwards using the
  `directionChange` EventEmitter. The `WebcamComponent` then reacts to this
  event and calls the game service's `setDirection()` method.

### 2.5 Class Diagram & Further Documentation

A high level UML diagram of the application was generated using
[tplant](tplant_link), you can click on the image to open the full view:

[![Snake Class Diagram][diagram]][diagram]

For further documentation, you can build and serve a [Compodoc](compodoc_link)
instance inside the app by running

```sh
npm run compodoc:build-and-serve
```

To build the Compodoc documentation into the `docs` folder without serving it,
you can run

```sh
npm run compodoc:build
```

An actual version of the UML diagram will be generated every time you run the
above commands. To only regenerate the UML diagram, you can run

```sh
npm run uml:overview
```

To serve the already built docs, you can run

```sh
npm run compodoc:serve
```

## 3. Contributing

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
[cover]: documentation_assets/cover.svg
[diagram]: documentation_assets/diagram.svg
[game_service_diagram]: documentation_assets/game-service-diagram.svg
[handpose_detection_link]:
  https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection
[tplant_link]: https://github.com/bafolts/tplant
[compodoc_link]: https://compodoc.app/
