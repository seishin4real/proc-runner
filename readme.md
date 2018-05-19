## Prerequisites
* clone or download
* run `npm i`
* run `npm i aurelia-cli -g`

## Dev & Debug
* open in VS Code
* run `au build -w`
* hit <kbd>F5</kbd>

## Build prerequisites
* run `npm run init-app`
* inside `dist-electron` run `npm i`

## Build
* run `npm run build` to run all the below in sequence
	* `npm run build-dist` - builds the aureila app for release
	* `npm run prepare-app` - prepares sources for electron executable build
	* `npm run build-exe` - builds the electron executable inside `dist-app` folder

## TODO
* templates editor
* detect process end -> reflect in state
