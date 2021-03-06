# Requirements

* NodeJS ^8.0.0
* NPM or yarn

# Installation

1. Install dependencies with `npm install` or `yarn`
2. `npm/yarn start` to start developing with hot-reload


## Log to Big-Data Cluster
1. Connect your Redux-Container to `src/actions/log` Actions.
2. Call one of the Actions (track, identify, ...)
3. All actions will be saved in Log-Reducer (View them in Chrome Dev Tools Redux Store)


Example:
```
this.props.page(); //Page tracking call
```

## Use App-Arena config values

To build a Widget with custom App-Arena config values all `aa_config_{configId}`
values are replaced by the customers config values

1. Define all your configIds and Values in the `src/config/aa_config.json`
(see the file for an example)
2. All Configs will be writen into the config-reducer inside the redux store.
3. Run `yarn run build` or `yarn run build:prod` and then
`yarn run aa:config:replace` to build a widget main js file and replace
your config values with the values inside of `build/apparena/config.json`


## Frame Actions

All Widgets of App-Arena are loaded via the [analytics.js](https://github.com/apparena/analytics.js) 
and build inside of an iframe with has 100% width and height on the customer website. To change positions or styles (width, height)
of the container outside of the iframe we provide an global API automatically added to all widgets. You can access all 
functions via ``window.frameActions``

| Function        | Description                                                                  | Params            |
|:----------------|:-----------------------------------------------------------------------------|:------------------|
| close()         | Closes the Widget and Removes the Iframe from the website                    | -                 |
| resize()        | Resize the hight, width of the widget based on the document height and width | -                 |
| changeStyle({}) | You can change the Style of the container by passing an Style-Object         | {height: '500px'} |
|                 |                                                                              |                   |
|                 |                                                                              |                   |
