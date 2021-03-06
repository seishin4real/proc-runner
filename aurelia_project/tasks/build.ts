import configureEnvironment from './environment';
import * as webpackConfig from '../../webpack.config';
import * as project from '../aurelia.json';
import { CLIOptions, Configuration } from 'aurelia-cli';
import * as del from 'del';
import * as gulp from 'gulp';
import * as webpack from 'webpack';

const analyze = CLIOptions.hasFlag('analyze');
const buildOptions = new Configuration(project.build.options);
const production = CLIOptions.getEnvironment() === 'prod';
const server = buildOptions.isApplicable('server');
const extractCss = buildOptions.isApplicable('extractCss');
const coverage = buildOptions.isApplicable('coverage');

const config = webpackConfig({
  production, server, extractCss, coverage, analyze
});
const compiler = webpack(<any>config);

function buildWebpack(done) {
  if (CLIOptions.hasFlag('watch')) {
    compiler.watch({}, onBuild);
  } else {
    compiler.run(onBuild);
    compiler.plugin('done', () => done());
  }
}

function onBuild(err, stats) {
  if (err) {
    console.error(err.stack || err);
    if (err.details) { console.error(err.details); }
    process.exit(1);
  } else {
    process.stdout.write(stats.toString({ colors: require('supports-color') }) + '\n');
  }
}

function clearDist() {
  return del([config.output.path]);
}

const build = gulp.series(
  clearDist,
  configureEnvironment,
  buildWebpack
);

export {
  config,
  buildWebpack,
  build as default
};
